import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function GetItemlabels(req, res) {
    const { id }: any = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    else {

        await prisma.itemLabelsAdded.findMany({
            where: {
                itemId: id + ""
            }
        }).then(labels => {
            res.status(200).json({
                labels: labels
            })
        })
    }
});
