import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

import { envs } from "../../config";
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class UserRoutes {
    static get routes(): Router {
        const router = Router();

      


        const userService = new UserService();
        const userController = new UserController(userService);
       


        router.post('/register', userController.register);
        router.post('/login', userController.login);
       
        router.use(AuthMiddleware.protect);
      router.get("/checking-session",userController.checkingSession)

        return router;//vamonos a routes.ts
    }
    
}