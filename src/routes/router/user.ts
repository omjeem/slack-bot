import { Controllers } from "@/controller";
import { authMiddleware } from "@/middlewares/authMiddleware";
import express from "express";

const userRouter = express.Router();

userRouter.get("/", authMiddleware, Controllers.user.profileDetails);
userRouter.post("/signup", Controllers.user.create);
userRouter.post("/signin", Controllers.user.login);

export default userRouter;
