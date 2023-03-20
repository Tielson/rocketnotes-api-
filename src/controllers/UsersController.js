const {
    hash,
    compare
} = require("bcryptjs")
const sqliteConnection = require("../database/sqlite")
const AppError = require("../Utils/AppError")

class UsersController {
    async create(req, res) {
        const { name, email, password } = req.body
        const database = await sqliteConnection()
        const hashPassword = await hash(password, 8)

        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        let result = email.includes('@' && ".com");

        if (!result) {
            throw new AppError("Coloque e-mail correto")
        }

        if (checkUserExists) {
            throw new AppError("Esse e-mail já está em uso.")
        }


        await database.run(
            "INSERT INTO users (name, email,password) VALUES (?,?,?) ",
            [name, email, hashPassword]
        )

        return res.status(201).json()
    }

    async update(req, res) {
        const { name, email, old_password, password } = req.body
        const user_id = req.user.id

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

        if (!user) {
            throw new AppError("Id do usuario não encontrado")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?) ", [email])

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email


        if (password && !old_password) {
            throw new AppError("Necessario a senha antiga para redefinir nova senha")
        }


        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if (!checkOldPassword) {
                throw new AppError("Senha antiga não confere")
            }

            user.password = await hash(password, 8)

        }

        await database.run(`
        UPDATE users SET 
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        )

        return res.json()
    }
}

module.exports = UsersController