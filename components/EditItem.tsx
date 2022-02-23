import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface EditItemProps {
	id: string;
}

function EditItem({ id }: EditItemProps) {
	const [details, setDetails] = useState({});
	const [loading, setLoading] = useState(true);
	const [itemLabels, setItemLabels] = useState([]);

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
				if (res.item.length > 0) {
					setDetails(res.item);
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
									setItemLabels(res);
								});
							}
							setLoading(false);
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
			{id}
			<pre>{JSON.stringify(details, null, 2)}</pre>
			<pre>{JSON.stringify(itemLabels, null, 2)}</pre>
			<div></div>
		</>
	);
}
export default EditItem;
