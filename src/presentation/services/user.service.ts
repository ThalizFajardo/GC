import { User } from "../../data/postgres/models/user.model";
import { RegisterUserDTO } from "../../domain/dtos/users/register-user.dto";
import { CustomError } from "../../domain/index-domain";
import { EmailService } from "./email.service";

import { encriptAdapter, envs } from "../../config";
import { JwtAdapter } from "../../config/jwt.adapter";
import { LoginUserDto } from "../../domain/dtos/users/login-user.dto";
import { Pin } from "../../data";

export class UserService {
  constructor(private readonly emailService: EmailService) {}

  async register(userData: RegisterUserDTO) {
    const user = new User();

    user.name = userData.name;
    user.surname = userData.surname;
    user.email = userData.email;
    user.cellphone = userData.cellphone;
    user.password = userData.password;

    try {
      const dbUser = await user.save();

      await this.createUserPin(userData.pin, userCreated);
      await this.sendEmailValidationLink(dbUser.email);

      return {
        id: dbUser.id,
        name: dbUser.name,
        surname: dbUser.surname,
        email: dbUser.email,
        cellphone: dbUser.cellphone,
        passwod: dbUser.password,
      };
    } catch (error: any) {
      if (error.code === "23505") {
        //23505 => error de duplicidad
        throw CustomError.badRequest(
          `⚠️ User with email: ${userData.email} already exists 🚫`
        );
      }
      throw CustomError.internalServer("❌ Error while creating user ⚠️");
    }
  }

  async login(credentials: LoginUserDto) {
    const user = await this.findUserByEmail(credentials.email); //encontrar al usuario

    const isMatching = await encriptAdapter.compare(
      //validarsi es correcto el password
      credentials.password,
      user.password
    );
    if (!isMatching)
      throw CustomError.unAuthorized("🚫 Invalid Credentials 🔑");

    const token = await JwtAdapter.generateToken(
      { id: user.id },
      envs.JWT_EXPRIRE_IN
    ); //todo bien se logeó correctamente
    if (!token)
      throw CustomError.internalServer("❌ Error while creating JWT 🔒");

    return {
      //enviando data al cliente..
      token: token,
      user: {
        id: user.id,
        name: user.name,
        // surname : user.surname,
        email: user.email,
        // cellphone : user.cellphone,
      },
    };
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user)
      throw CustomError.notFound(`🔍User with email: ${email} not found`);

    return user;
  }

  public sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email }, "300s");
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `http://${envs.WEB_SERVICE_URL}/api/user/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>Click on the following link to validate your email</p>
    <a href="${link}">Validate your email: ${email}</a>
  `;
    const isSent = this.emailService.sendEmail({
      to: email,
      subject: "Validate your account",
      htmlBody: html,
    });
    if (!isSent)
      throw CustomError.internalServer("📧❌ Error sending email 🚫");

    return true;
  };

  validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest("🚫 Invalid Token 🔑❌");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("📧❌ Email not in token 🚫");

    const user = await User.findOne({ where: { email: email } });
    if (!user) throw CustomError.internalServer("📧❌ Email does not exist 🚫");

    try {
      await user.save();

      return {
        message: "✅ Usuario activado 🎉",
      };
    } catch (error) {
      throw CustomError.internalServer("⚠️❌ Something went very wrong 😥");
    }
  };

  async getUserProfile(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async findOne(userId: string) {
    const result = await User.createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .getOne();

    if (!result) {
      throw CustomError.notFound("🔍❌ User not found 🚫");
    }

    return result;
  }

  async createUserPin(pin: string, user: User) {
    const userPin = new Pin();

    userPin.code = pin;
    userPin.user = user;

    try {
      await userPin.save();
      return {
        ok: true,
      };
    } catch (error) {
      throw CustomError.internalServer("Error while creating pin");
    }
  }

  async checkingSession(user: User) {
    const userValidated = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      cellphone: user.cellphone,
      passwod: user.password,
    };
    return userValidated;
  }
}
