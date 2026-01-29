import Constants from "@/config/constants";
import { errorResponse, successResponse } from "@/config/response";
import { Services } from "@/services";
import { Request, Response } from "express";

export class user {
  static create = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = Services.jwtService.hashPassword(password, email);
      const user = await Services.user.createUser(name, email, hashedPassword);
      const token = await Services.jwtService.generateJwt(email, user._id);
      return successResponse(res, "User created Successfully", { token });
    } catch (error: any) {
      console.log({ error });
      let message = error.message;
      if (error.code === 11000) {
        message =
          "User with this email already registered! please try with different one";
      }
      return errorResponse(res, message);
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const userDetails = await Services.user.findByEmail(email);
      if (!userDetails) {
        throw new Error("User not found of this given email");
      }
      const isPasswordMatched = Services.jwtService.verifyPassword(
        password,
        email,
        userDetails.password!,
      );

      if (!isPasswordMatched) {
        throw new Error("Invalid Password");
      }

      const token = await Services.jwtService.generateJwt(
        email,
        userDetails._id!,
      );
      return successResponse(res, "User Loggedin Successfully!", { token });
    } catch (error: any) {
      return errorResponse(
        res,
        error.message,
        Constants.STATUS_CODES.UNAUTHORIZED,
      );
    }
  };
  static profileDetails = async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const userData = await Services.user.findByUserId(userId);
      return successResponse(
        res,
        "User profile fetched successfully",
        userData,
      );
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  };
}
