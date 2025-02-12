import { Router } from "express";
import { UserRoutes } from "./users/user.routes";


export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Registrando las rutas...
    router.use("/api/users", UserRoutes.routes);

    return router;
  }
}

