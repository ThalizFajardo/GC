import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { RegisterUserDTO } from "../../domain/dtos/users/register-user.dto";
import { LoginUserDto } from "../../domain/dtos/users/login-user.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { error } from "console";

export class UserController {
  constructor(private readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .register(registerUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .login(loginUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };


checkingSession= async(req: Request, res: Response)=>{
  const user =  req.body.sessionUser;

  this.userService.checkingSession(user)
  .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
}

}
