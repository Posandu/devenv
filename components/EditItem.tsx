import { Checkbox, Input, Button, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Background from "./Background";

interface EditItemProps {
	id: string;
}

interface ItemProps {
	id: string;
	name: string;
	description: string;
	tags: string[];
	ispublic: boolean;
	background: any;
}

function EditItem({ id }: EditItemProps) {
	const [details, setDetails] = useState<ItemProps>();
	const [loading, setLoading] = useState(true);
	const [allLabels, setAllLabels] = useState<any>([]);
	/**
	 * Value states
	 */
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState([]);
	const [background, setBackground] = useState<any>("");
	const [labels, setLabels] = useState([]);
	const [ispublic, setIspublic] = useState(false);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_URL}/api/getSingleItem`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: id,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.item) {
					setDetails(res.item);
					setName(res.item.name || "");
					setDescription(res.item.description);
					setTags(res.item.tags.split(",") || []);
					setBackground(res.item.background || "no");
					setIspublic(res.item.public);
					// Get labels
					fetch(`${process.env.NEXT_PUBLIC_URL}/api/getItemLabels`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							id: id,
						}),
					})
						.then((res) => res.json())
						.then((res) => {
							const labels = res.labels;
							if (labels.length > 0) {
								/**
								 * For each label, fetch the label name and color
								 */
								const labels_fetched = labels.map(
									async (label: { labelId: string }): Promise<any> =>
										fetch(`${process.env.NEXT_PUBLIC_URL}/api/getSingleLabel`, {
											method: "POST",
											headers: {
												"Content-Type": "application/json",
											},
											body: JSON.stringify({
												id: label.labelId,
											}),
										})
											.then((res) => res.json())
											.then((res) => {
												return res;
											})
								);

								Promise.all(labels_fetched).then((res) => {
									setLabels(res.map((label: any) => label["label"].id));
								});
							}
							setLoading(false);
						});

					/**
					 * Fetch all labels
					 */
					fetch(`${process.env.NEXT_PUBLIC_URL}/api/getLabels`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
					})
						.then((res) => res.json())
						.then((res) => {
							if (res.labels) {
								setAllLabels(res.labels);
							}
						});
				} else {
					toast.error("Could not find item");
					document.dispatchEvent(new Event("__close__dialog"));
				}
			});
	}, []);

	return (
		<>
			<h1>Item</h1>
			{loading && <CircularProgress />}
			{!loading && details && (
				<>
					<div className="p-2"></div>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Name"
					/>

					<div className="p-2"></div>
					<Input
						multiline
						value={description}
						rows={5}
						placeholder="Description"
						onChange={(e) => setDescription(e.target.value)}
					/>
					<div className="p-2"></div>
					<Input
						value={tags.join(",")}
						placeholder="Tags (comma separated)"
						onChange={(e) => setTags(e.target.value.split(","))}
					/>
					<div className="p-2"></div>
					<div className="flex">
						{[...Array(4)].map((_, i) => {
							i += 1;
							return (
								<button
									key={i}
									onClick={() => {
										setBackground(+i);
									}}
									className={`relative inline-flex items-center justify-center ${
										+i === background ? "bg-gray-200 ring-4 z-50" : ""
									}`}
								>
									<Background id={i} size={4} />
								</button>
							);
						})}
						<button
							onClick={() => {
								setBackground("no");
							}}
						>
							<p className="text-gray-600 text-xs">
								{background == "no" ? (
									<>
										Current
										<br />
									</>
								) : (
									""
								)}
								<span className="text-gray-600">No background</span>
							</p>
						</button>
					</div>
					<div className="p-2"></div>
					<h2>Labels</h2>
					<div className="flex">
						{allLabels.map((label) => {
							return (
								<button
									key={label.id}
									onClick={() => {
										if (labels.includes(label.id)) {
											setLabels(labels.filter((l) => l !== label.id));
										} else {
											setLabels([...new Set([...labels, label.id])]);
										}
									}}
									className={`color-${label.color} ${
										labels.includes(label.id) ? "ring-4" : ""
									} mr-4 mt-4 p-1 rounded`}
								>
									{label.name}
								</button>
							);
						})}
					</div>
					<div className="p-2"></div>
					<h2>Public</h2>
					<Checkbox
						checked={ispublic}
						onChange={(e) => setIspublic(e.target.checked)}
					/>
					<div className="p-2"></div>
					<Button
						onClick={() => {
							setLoading(true);
							fetch(process.env.NEXT_PUBLIC_URL + "/api/updateItem", {
								method: "PATCH",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									id: details.id,
									title: name,
									description: description,
									tags: tags,
									bg: background,
									labels: labels,
									ispublic: ispublic,
								}),
							})
								.then((res) => res.json())
								.then((res) => {
									if (res.success) {
										document.dispatchEvent(new CustomEvent("__close__dialog"));
										toast.success("Item updated");
									} else {
										toast.error("Error updating item");
										setLoading(false);
									}
								});
						}}
						disabled={loading}
					>
						Update
					</Button>

					<Button
						onClick={() => {
							document.dispatchEvent(new CustomEvent("__close__dialog"));
						}}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							fetch(process.env.NEXT_PUBLIC_URL + "/api/deleteItem", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									id: details.id,
									trash: true,
								}),
							})
								.then((res) => res.json())
								.then((res) => {
									if (res.success) {
										document.dispatchEvent(new CustomEvent("__close__dialog"));
										toast.success("Item deleted");
									} else {
										toast.error("Error deleting item");
										setLoading(false);
									}
								});
						}}
						disabled={loading}
						color="error"
					>
						Move to trash
					</Button>
				</>
			)}
		</>
	);
}
export default EditItem;
