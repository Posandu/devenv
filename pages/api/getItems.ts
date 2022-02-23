import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function GetItems(req, res) {
    const { user } = getSession(req, res);

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    else {
        const items = await prisma.items.findMany({
            where: {
                owner: user.sub
            }
        })
        res.status(200).json({
            items: items
        })
    }
});
