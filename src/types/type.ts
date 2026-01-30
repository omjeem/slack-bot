import { Types } from "mongoose";

export interface UserTokenPayload {
  user: {
    userId: string;
    email: string;
  };
}

