import { UserTokenPayload } from "./type";

declare module "express-serve-static-core" {
  interface Request extends UserTokenPayload  {}
}
