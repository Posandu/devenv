import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function deleteLabel(req, res) {
    const { user } = getSession(req, res);
    const { id } = req.body;

    if (req.method !== 'DELETE') {
        res.status(400).send({ message: 'Only DELETE requests allowed' })
        return
    }

    if (!id || !id.trim()) {
        res.status(400).send('ID is required');
        return;
    }

    const deleteItem = async () => {
        /**
         * Check if the label exists
         *  */
        const label = await prisma.labels.findMany({
            where: {
                id: id,
                owner: user.sub
            }
        });

        if (!label.length) {
            res.status(404).send({ message: 'Label not found' });
            return;
        }

        // Delete the label
        const deletedLabel = await prisma.labels.delete({
            where: {
                id: id,
            }
        });

        /**
         * Delete all the label's items
         */
        const deletedItems = await prisma.itemLabelsAdded.deleteMany({
            where: {
                labelId: id
            }
        });

        res.status(200).send({
            message: 'Label deleted',
            deletedLabel,
            deletedItems
        });
    }

    deleteItem();
});