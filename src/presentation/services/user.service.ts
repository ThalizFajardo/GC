import { User } from "../../data/postgres/models/user.model";
import { Pin } from "../../data";
import { LoginUserDto } from "../../domain/dtos/users/login-user.dto";
import { RegisterUserDTO } from "../../domain/dtos/users/register-user.dto";
import { CustomError } from "../../domain/index-domain";
import { JwtAdapter } from "../../config/jwt.adapter";
import { encriptAdapter } from "../../config";

export class UserService {
 
  async register(userData: RegisterUserDTO) {
    const user = new User();

    user.name = userData.name;
    user.surname = userData.surname;
    user.email = userData.email;
    user.cellphone = userData.cellphone;
    user.password = userData.password;

    try {
      const dbUser = await user.save();

      await this.createUserPin(userData.pin, dbUser);
   
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

  async login(userCredentials: LoginUserDto) {
    const user = await User.findOne({
      where: { email: userCredentials.email, status: true },
  });

  if (!user) {
    throw CustomError.notFound("User not found");
}

    
    const isMatching = encriptAdapter.compare(
        userCredentials.password,
        user.password
    );

    if (!isMatching) {
        throw CustomError.badRequest("Invalid credentials");
    }

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return {
        token,
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        cellphone: user.cellphone,
    };
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
    };
    return userValidated;
  }
}
