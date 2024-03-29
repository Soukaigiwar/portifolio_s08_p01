const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
    async update(request, response) {
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const user = await knex("users")
            .where({ id: user_id })
            .first();

        if (!user) {
            throw new AppError("Somente usuários autenticados podem alterar a foto de perfil.", 401);
        };

        const diskStorage = new DiskStorage();

        if (user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename;

        await knex("users")
            .update(user)
            .where({ id: user_id });

        return response.json(user);
    };
};

module.exports = UserAvatarController;
