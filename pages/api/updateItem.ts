import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function UpDateItem(req, res) {
    const { user } = getSession(req, res);
    const { title, description, bg, tags, labels, ispublic, id } = req.body;

    if (req.method !== 'PATCH') {
        res.status(400).send({ message: 'Only PATCH requests allowed' })
        return
    }

    let success = false;
    let message = '';
    let _tags = tags.join(',') || '';
    let _labels = labels || [];
    let _description = description.trim() || '';
    let _bg = bg || 'no';
    let _title = title.trim() || '';
    let itemID = id;


    /**
     * Check if all required fields are present
     */
    if (_description.length < 2) {
        message = 'Description is required';

    }
    else {
        const updated = await prisma.items.updateMany({
            data: {
                name: _title,
                description: _description,
                background: _bg + "",
                tags: _tags,
                owner: user.sub,
                public: ispublic,
            },
            where: {
                id: itemID,
                owner: user.sub
            }
        });

        if (updated) {
            if (_labels.length > 0) {
                _labels.forEach(async (label) => {
                    /**
                     * Remove old labels
                     */
                    await prisma.itemLabelsAdded.deleteMany({
                        where: {
                            itemId: itemID,
                            labelId: label
                        }
                    });

                    await prisma.itemLabelsAdded.create({
                        data: {
                            itemId: id,
                            labelId: label,
                        }
                    });
                });
            }
            success = true;
            message = 'Item edited successfully';
        } else {
            message = 'Something went wrong';
        }
    }


    res.status(200).json({
        success: success,
        message: message,
    });
});
