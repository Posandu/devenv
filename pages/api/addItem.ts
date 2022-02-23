import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function AddItem(req, res) {
    const { user } = getSession(req, res);
    const { title, description, bg, tags, labels, _public } = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    let success = false;
    let message = '';
    let _tags = tags.join(',') || '';
    let _labels = labels || [];
    let _description = description.trim() || '';
    let _bg = bg.toString() || 'no';
    let _title = title.trim() || '';


    /**
     * Check if all required fields are present
     */
    if (_description.length < 2) {
        message = 'Description is required';

    }
    else {
        const itemAdded = await prisma.items.create({
            data: {
                name: _title,
                description: _description,
                background: _bg,
                tags: _tags,
                owner: user.sub,
                public: _public || false,
            }
        });

        if (itemAdded) {
            if (_labels.length > 0) {
                _labels.forEach(async (label) => {
                    const labelAdded = await prisma.itemLabelsAdded.create({
                        data: {
                            itemId: itemAdded.id,
                            labelId: label,
                        }
                    });
                });
            }
            success = true;
            message = 'Item added successfully';
        } else {
            message = 'Something went wrong';
        }
    }


    res.status(200).json({
        success: success,
        message: message,
    });
});
