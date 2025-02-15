import { regularExp } from "../../../config/regular-exp";



export class RegisterUserDTO {
  constructor(
    public name: string,
    public surname: string,
    public email: string,
    public cellphone: string,
    public password: string,
    public pin: string,   
  ) { }

  static create(object: { [key: string]: any }): [string?, RegisterUserDTO?] {
    const { name,surname, email,cellphone, password, pin } = object;

    if (!name) return ["⚠️ Missing name 🚫"];
    if (!surname) return ["⚠️ Missing surname 🚫"];
    if (!email) return ["⚠️ Missing email 📧🚫"];
    if (!cellphone) return ["⚠️ Missing cellphone 📧🚫"];
    if (!password) return ["⚠️ Missing password 🔑🚫"];
    if (!regularExp.password.test(password))
      return [
        "⚠️ The password must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, and one special character 🔒",
      ];
      
    return [undefined,
      new RegisterUserDTO(name,surname, email, cellphone, password, pin)];

  }

}

