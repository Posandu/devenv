import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function AddLabel(req, res) {
    const { user } = getSession(req, res);
    const { label, color } = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    if (!label || !label.trim()) {
        res.status(400).send('Label is required');
        return;
    }

    else {
        const newLabel = await prisma.labels.create({
            data: {
                name: label.trim(),
                color: `${color || 0}`,
                owner: user.sub
            }
        });

        res.status(200).send(newLabel);
    }
});
