import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function deleteLabel(req, res) {
    const { user } = getSession(req, res);
    const { id, trash } = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    if (!id || !id.trim()) {
        res.status(400).send('ID is required');
        return;
    }

    const restoreItem = async () => {
        /**
         * Check if the item exists
         *  */
        const item = await prisma.items.findMany({
            where: {
                id: id,
                owner: user.sub,
                deleted: true,
            }
        });

        if (!item.length) {
            res.status(404).send({ message: 'Item not found' });
            return;
        }


        const deletedItem = await prisma.items.updateMany({
            where: {
                id: id,
                owner: user.sub,
                deleted: true,
            },
            data: {
                deleted: false,
            }
        });

        res.status(200).send({
            message: 'Item restored',
            success: true
        });
    }

    restoreItem();
});