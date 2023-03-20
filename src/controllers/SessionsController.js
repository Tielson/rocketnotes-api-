const appError = require("../Utils/AppError")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")
const knex = require("../database/knex")
const { compare } = require("bcryptjs")
class SessionsController {
    async create(req, res) {
        const { email, password } = req.body

        const user = await knex("users").where({ email }).first();

        if (!user) {
            throw new appError("E-mail e/ou senha incorreta", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new appError("E-mail e/ou senha incorreta", 401)
        }

        const { secret, expiresIn } = authConfig.jwt
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return res.json({ user, token })
    }
}

module.exports = SessionsController