import { CredentialStorage,SecurityBox,securityBoxStatus, User } from "../../data";
import {SecurityBoxDto} from "../../domain/dtos/security-box/security-box.dto";
import { CustomError } from "../../domain/index-domain";



export class SecurityBoxService {
  async listSecurityBoxes(
    orderBy: "name" | "createdAt" | "credentialsCount" = "name",
    orderDirection: "ASC" | "DESC" = "ASC",
    favorite?: boolean
  ) {
    const queryBuilder = SecurityBox.createQueryBuilder("securityBox")
      .leftJoinAndSelect("securityBox.credentialStorages", "credentialStorage")
      .select([
        "securityBox.id",
        "securityBox.name",
        "securityBox.favorite",
        "securityBox.icon",
        "securityBox.status",
        "securityBox.createdAt",
      ])
      .addSelect("COUNT(DISTINCT credentialStorage.id)", "credentialsCount")
      .where("securityBox.status = :status", {
        status: securityBoxStatus.ACTIVE,
      })
      .groupBy("securityBox.id");
    if (favorite !== undefined) {
      queryBuilder.andWhere("securityBox.favorite = :favorite", { favorite });
    }
    if (orderBy === "name") {
      queryBuilder.orderBy("securityBox.name", orderDirection);
    } else if (orderBy === "createdAt") {
      queryBuilder.orderBy("securityBox.createdAt", orderDirection);
    } else if (orderBy === "credentialsCount") {
      queryBuilder.orderBy("credentialsCount", orderDirection);
    }
    return await queryBuilder.getMany();
  }
  async createSecurityBox(securityBoxData: SecurityBoxDto, user: User) {
    const securityBox = new SecurityBox();
    securityBox.favorite = securityBoxData.favorite;
    securityBox.name = securityBoxData.name;
    securityBox.icon = securityBoxData.icon;
    securityBox.user = user;
    try {
      const savedSecurityBox = await securityBox.save();
      // Eliminar el password antes de devolver la respuesta
      if (savedSecurityBox.user) {
        const { password, ...userWithoutPassword } = savedSecurityBox.user;
        savedSecurityBox.user = userWithoutPassword as User;
      }
      return savedSecurityBox;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer("Internal Server Error!");
    }
  }
  async addSecurityBoxToFavorite(securityBoxId: string) {
    /*const securityBox = await this.getSecurityBoxDetail(securityBoxId);
    securityBox.favorite = !securityBox.favorite;
    try {
      return await securityBox.save();
    } catch (error) {
      throw CustomError.internalServer("Internal Server Error!");
    }*/
  }
  async getSecurityBoxDetail(
    securityBoxId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const securityBox = await SecurityBox.findOne({
      where: {
        id: securityBoxId,
        status: securityBoxStatus.ACTIVE,
      },
    });
    if (!securityBox) {
      throw CustomError.notFound(
        `securityBox with id: ${securityBoxId} not found`
      );
    }
    const [credentialStorages, total] = await CredentialStorage.findAndCount({
      where: {
        securityBox: {
          id: securityBoxId,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      securityBox,
      credentialStorages: {
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        currentPage: page,
        data: credentialStorages,
      },
    };
  }
}