import { Router } from "express";
import { UserRoutes } from "./users/user.routes";


export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Registrando las rutas...
    router.use("/api/v1/user", UserRoutes.routes);

    return router;
  }
}

