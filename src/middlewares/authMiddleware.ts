import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../config/response";
import Constants from "../config/constants";
import { Services } from "@/services";
import { envConfigs } from "@/config/envConfig";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req["headers"]["authorization"] || envConfigs.defaultToken;
    
    if (!token) {
      throw new Error("Token not found");
    }
    const tokenBody = token.split(" ");
    if (tokenBody.length !== 2) {
      throw new Error("Invalid token");
    }
    if (tokenBody[0] !== "Bearer") {
      throw new Error("Invalid token");
    }
    const tokenString = tokenBody[1] || "";
    const jwtData = Services.jwtService.verifyTokenAndGetPayload(tokenString);
    if (!jwtData.valid) {
      throw new Error(jwtData.error);
    }
    req.user = {
      ...jwtData.data.user,
    };
    next();
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || error,
      Constants.STATUS_CODES.UNAUTHORIZED,
    );
  }
};
