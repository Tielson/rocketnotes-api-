const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const TagsController = require('../controllers/TagsController')
const tagsController = new TagsController()
const { Router } = require("express")
const tagsRoutes = Router()

tagsRoutes.get("/", ensureAuthenticated, tagsController.index)

module.exports = tagsRoutes