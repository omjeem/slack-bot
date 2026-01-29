import express from "express"
import slackRouter from "./router/slack";
import userRouter from "./router/user";

const mainRouter = express.Router()

mainRouter.use("/slack", slackRouter)
mainRouter.use("/user", userRouter)


export default mainRouter;