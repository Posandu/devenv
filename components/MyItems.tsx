import { CircularProgress, Button, Tooltip, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import Item from "./Item";
import Image from "next/image";
import { BiRefresh } from "react-icons/bi";
import { useUser } from "@auth0/nextjs-auth0";

interface Props {
	userid: string;
	trash?: boolean;
	archived?: boolean;
	label?: string;
}

function MyItems({ userid, trash, archived, label }: Props) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const { user, error, isLoading } = useUser();

	useEffect(() => {
		console.log("Refreshing...");
		const fetchItems = async () => {
			const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/getItems", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					trash: trash || false,
					archived: archived || false,
					label: label || null,
				}),
			});
			const data = await res.json();
			setItems(data.items);
			setLoading(false);
		};
		fetchItems();
	}, [refresh]);

	useEffect(() => {
		setInterval(() => {
			setRefresh(!refresh);
		}, 10000);
	}, []);

	return (
		<div>
			<div className="mb-4 items-center">
				<h1 className="text-4xl shorter inline-block m-0">
					{archived ? "Archived" : trash ? "Trash" : "My"} Items
				</h1>
				<Tooltip title="Refresh">
					<IconButton
						className={(loading ? "animate-spin" : "") + " inline-block"}
						children={<BiRefresh />}
						onClick={() => {
							setRefresh(!refresh);
							console.log("Refreshing...");
						}}
					/>
				</Tooltip>
				{trash && !archived && (
					<Button
						onClick={() => {
							setLoading(true);
							fetch(process.env.NEXT_PUBLIC_URL + "/api/emptyTrash", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									userid: userid,
								}),
							})
								.then((res) => res.json())
								.then((res) => {
									if (res.success) {
										setRefresh(!refresh);
									}
								});
						}}
						disabled={isLoading}
					>
						Empty Trash
					</Button>
				)}
			</div>

			{loading && <CircularProgress className="m-4" />}
			{!loading &&
				items.map((item) => (
					<Item
						key={item.id}
						id={item.id}
						title={item.name}
						description={item.description}
						bg={item.background}
						ispublic={item.public}
						tags={item.tags && item.tags.split(",")}
						userid={userid}
						user={user.sub}
						trash={trash}
						archived={archived}
					/>
				))}
			{!loading && items.length === 0 && (
				<div className="flex items-center justify-center p-16 bg-gray-50 w-full rounded">
					<div className="text-center">
						<Image src="/images/empty.svg" width={300} height={200} />
						<h1 className="text-2xl mt-2 mb-1">No Items</h1>
						<Button
							onClick={() => {
								setRefresh(!refresh);
							}}
						>
							Refresh
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
export default MyItems;
