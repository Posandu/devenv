import prisma from "../../lib/prisma";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function explore(req, res) {
    const { user } = getSession(req, res);
    const { page, search, _public } = req.body;

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    let __owner = !_public ? user.sub : undefined;

    const _filtered_query = search.replace(/[^a-zA-Z0-9]/g, '');

    if (_filtered_query.length < 3 && _filtered_query.length !== 0) {
        res.status(400).json({ message: 'Search query must be at least 3 characters long', items: [] })
        return
    }

    const getItems = async ({ search, _public = true }: { search: string; _public: boolean; }) => {
        const itemsCount = await prisma.items.count({
            where: {
                public: _public,
                owner: __owner,
                description: {
                    contains: _filtered_query,
                },
                deleted: false,
                archived: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (itemsCount === 0) {
            return {
                items: [],
                itemsCount: 0,
                message: 'No items found',
            }
        }

        else {
            let limit = 1000000000;
            if (_filtered_query.length < 3) {
                limit = 40;
            }
            const items = await prisma.items.findMany({
                where: {
                    public: _public,
                    owner: __owner,
                    description: {
                        contains: _filtered_query,
                    },
                    deleted: false,
                    archived: false
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
            });

            return {
                message: null,
                items: items,
                itemsCount: itemsCount,
            }
        }
    }

    const items = await getItems({ search, _public });

    res.status(200).send(items);
});
