import { Request, Response } from "express";
import { SecurityBoxService } from "../services/security-box.service";
import { SecurityBoxDto } from "../../domain/dtos/security-box/security-box.dto";
import { CustomError } from "../../domain/index-domain"; 


export class SecurityBoxController {
    constructor(private readonly securityBoxService: SecurityBoxService) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json({ message: error.message });
        }
    
        console.log(error);
        return res.status(500).json({ message: "Something went very wrong! 🧨" });
      };
    
    
    listSecurityBoxes = (req: Request, res: Response) => {
        const orderBy = (req.query.orderBy as "name"| "createAt" | "credentialsCpunt") || "name";

        const orderDirection =
    (req.query.orderDirection as "ASC" | "DESC") || "ASC";

    const favorite = req.query.favorite !== undefined ? req.query.favorite === "true" : null;

        this.securityBoxService
            .listSecurityBoxes()
            .then((securityBox) => res.status(200).json(securityBox))
            .catch((error) => this.handleError (error, res));
    };

    createSecurityBox = (req: Request, res: Response) => {
        const [error, securityBoxDto] = SecurityBoxDto.execute(req.body);
        const sessionUser = req.body;
    
        if (error) return res.status(422).json({ message: error });
    
        this.securityBoxService
            .createSecurityBox(securityBoxDto!, sessionUser)
            .then((data) => res.status(201).json(data))
            .catch((error: unknown) => this.handleError (error, res));
    };
    
    addSecurityBoxToFavorite = (req: Request, res: Response) => {
        const { id } = req.params;
    
        this.securityBoxService
            .addSecurityBoxToFavorite(id)
            .then((data) => res.status(200).json(data))
            .catch((error: unknown) => this.handleError (error, res));
    };
    
    getSecurityBoxDetail = (req: Request, res: Response) => {
        const { id } = req.params;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
    
        this.securityBoxService
            .getSecurityBoxDetail(id, +page, +limit)
            .then((data) => res.status(200).json(data))
            .catch((error: unknown) => this.handleError (error, res));
    };
    

    findAndCount = (req: Request, res: Response) => {}
}
