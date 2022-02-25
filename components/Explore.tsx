import { Checkbox, IconButton, Input } from "@mui/material";
import { useState, useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import Item from "./Item";

function ExploreAll({ me }) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [query, setQuery] = useState("");
	const [_public, setPublic] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			fetch(process.env.NEXT_PUBLIC_URL + "/api/explore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					search: query,
					_public: _public,
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					setItems(res.items);

					setLoading(false);
				});
		};
		fetchData();
	}, [query, _public, refresh]);

	return (
		<div>
			<h1 className="text-4xl shorter">Explore</h1>
			<Input
				placeholder="Search"
				onKeyDown={(e: any) => {
					// Check if enter key pressed
					if (e.keyCode === 13) {
						setRefresh(!refresh);
						setQuery(e.target.value);
					}
				}}
			/>
			<Checkbox
				checked={_public}
				onChange={(e) => {
					setPublic(e.target.checked);
					setRefresh(!refresh);
				}}
			/>
			Public?
			<IconButton
				onClick={() => {
					setRefresh(!refresh);
				}}
				className={`${loading && "animate-spin"}`}
			>
				<BiRefresh />
			</IconButton>
			<div>
				{items.map((item, index) => {
					return (
						<Item
							key={index}
							id={item.id}
							title={item.name}
							description={item.description}
							bg={item.background}
							user={item.owner}
							archived={item.archived}
							ispublic={item.ispublic}
							tags={item.tags.split(",")}
							trash={item.trash}
							userid={me}

						/>
					);
				})}
			</div>
		</div>
	);
}
export default ExploreAll;
