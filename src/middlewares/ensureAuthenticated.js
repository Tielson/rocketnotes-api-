const { verify } = require("jsonwebtoken")
const appError = require("../Utils/AppError")
const authConfig = require("../configs/auth")

function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        throw new appError("Token não informado", 401)
    }

    const [, token] = authHeader.split(" ")
    try {
        const { sub: user_id } = verify(token, authConfig.jwt.secret)

        req.user = {
            id: Number(user_id),
        }   
        return next();
    }

    catch {
        console.log(token)
        throw new appError("JWT Token inválido", 401)
    }
}

module.exports = ensureAuthenticated