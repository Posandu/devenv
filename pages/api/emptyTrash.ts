import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function emptyTrash(req, res) {
    const { user } = getSession(req, res);

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    const deleteItem = async () => {
        const { count } = await prisma.items.deleteMany({
            where: {
                deleted: true,
                owner: user.sub
            }
        });

        res.status(200).json({
            message: 'Items deleted',
            count
        });
    }

    deleteItem();
});