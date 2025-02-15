process.loadEnvFile();
import { get } from "env-var";

export const envs = {
    PORT: get("PORT").required().asPortNumber(),
    DB_HOST: get("HOST_DATABASE").required().asString(),
    DB_USERNAME: get("USERNAME_DATABASE").required().asString(),
    DB_PASSWORD: get("PASSWORD_DATABASE").required().asString(),
    DB_DATABASE: get("DATABASE").required().asString(),
    DB_PORT: get("PORT_DATABASE").required().asPortNumber(),
  
    JWT_SEED: get("JWT_SEED").required().asString(),
    JWT_EXPRIRE_IN: get("JWT_EXPRIRE_IN").required().asString(),
  
    WEB_SERVICE_URL: get("WEB_SERVICE_URL").required().asString()

  };
  
  