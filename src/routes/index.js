const { Router } = require('express')

const notesRouter = require("./notes.routes")
const userRouter = require("./users.routes")
const tagsRoutes = require("./tags.routes")
const sessionsRouter = require("./sessions.routes")

const routes = Router()

routes.use("/notes", notesRouter)
routes.use("/user", userRouter)
routes.use("/tags", tagsRoutes)
routes.use("/sessions", sessionsRouter)

module.exports = routes