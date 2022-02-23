import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function GetLabels(req, res) {
    const { user } = getSession(req, res);
    const { id } = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    else {
        const label = await prisma.labels.findUnique({
            where: {
                id: id as string,
            }
        });
        res.status(200).json({ label: label });
    }
});
