import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function GetItems(req, res) {
    const { user } = getSession(req, res);
    const { trash, archived, label } = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    else {
        if (label !== null) {
            /**
             * Check if label exists
             */
            const labelE = await prisma.labels.findUnique({
                where: {
                    id: label
                }
            })

            if (!labelE) {
                res.status(400).send({ message: 'Label does not exist' })
                return
            }

            const labelItems = await prisma.itemLabelsAdded.findMany({
                where: {
                    labelId: label
                }
            })

            /**
             * For each item get it's data and push it
             */

            const all = async () => {
                let final; final = [];
                for (let i = 0; i < labelItems.length; i++) {
                    const item = await prisma.items.findFirst({
                        where: {
                            id: labelItems[i].itemId,
                            archived: false,
                            deleted: false
                        }
                    })
                    final.push(item)
                }
                return final.filter(e => e)
            }

            res.status(200).json({
                items: await all()
            })

            return
        }

        const items = await prisma.items.findMany({
            where: {
                owner: user.sub,
                archived: archived ? archived : false,
                deleted: trash ? true : false
            }
        })

        res.status(200).json({
            items: items
        })
    }
});
