import { prisma } from "../lib/prisma.js";

export const homeController = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique(
            {
                where:{id: userId}
            }
        );

        return res.status(200).json(user);


    } catch (err) {
        next(err);
    }
}