import jwtService from "./auth/jwt";
import { slack } from "./db/slack";
import user from "./db/user";

export const Services =  {
    jwtService,
    user,
    slack
}