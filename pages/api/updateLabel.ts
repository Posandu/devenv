import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function updateLabel(req, res) {
    const { user } = getSession(req, res);
    const { label, color, id } = req.body;

    if (req.method !== 'PATCH') {
        res.status(400).send({ message: 'Only PATCH requests allowed' })
        return
    }

    if (!label || !label.trim() || !color || !id || !id.trim()) {
        res.status(400).send('Fields are required');
        return;
    }

    else {
        const updatedLabel = await prisma.labels.update({
            where: {
                id: id,
            },
            data: {
                name: label,
                color: ((+color > 0 && +color <= 9) ? +color : 1).toString(),
            }
        });
        res.status(200).json({ label: updatedLabel });
    }
});
