import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function archiveItem(req, res) {
    const { user } = getSession(req, res);
    const { id } = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    if (!id || !id.trim()) {
        res.status(400).send('ID is required');
        return;
    }

    const deleteItem = async () => {
        /**
         * Check if the item exists
         *  */
        const item = await prisma.items.findMany({
            where: {
                id: id,
                owner: user.sub,
                deleted: false
            }
        });

        if (!item.length) {
            res.status(404).send({ message: 'Item not found' });
            return;
        }

        const archived = await prisma.items.updateMany({
            where: {
                id: id,
                owner: user.sub,
                deleted: false
            },
            data: {
                archived: true
            }
        });

        res.status(200).send({
            message: 'Item archived',
            success: true
        });
    }

    deleteItem();
});