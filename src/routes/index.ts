import express from "express"
import slackRouter from "./router/slack";

const mainRouter = express.Router()

mainRouter.use("/slack", slackRouter)


export default mainRouter;