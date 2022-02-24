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

    const deleteItem = async () => {
        /**
         * Check if the item exists
         *  */
        const item = await prisma.items.findMany({
            where: {
                id: id,
                owner: user.sub
            }
        });

        if (!item.length) {
            res.status(404).send({ message: 'Item not found' });
            return;
        }

        // Delete the item
        if (!trash) {
            const deletedItem = await prisma.items.deleteMany({
                where: {
                    id: id,
                    owner: user.sub
                }
            });

            /**
             * Delete all the item's labels
             */
            const deletedItems = await prisma.itemLabelsAdded.deleteMany({
                where: {
                    itemId: id
                }
            });

            res.status(200).send({
                message: 'Item deleted',
                success: true
            });
        }
        
        else {
            const deletedItem = await prisma.items.updateMany({
                where: {
                    id: id,
                    owner: user.sub
                },
                data: {
                    deleted: true
                }
            });

            res.status(200).send({
                message: 'Item moved to trash',
                success: true
            });
        }
    }

    deleteItem();
});