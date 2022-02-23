import { Button, Checkbox, CircularProgress } from "@mui/material";
import Router from "next/router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SelectLabelprops {
	selected?: string[];
}

function SelectLabel({ selected = [] }: SelectLabelprops) {
	const [loading, setLoading] = useState(true);
	const [labels, setLabels] = useState<string[]>([]);
	const [selectedLabels, setSelectedLabels] = useState<string[]>(selected);

	useEffect(() => {
		setLabels(selected);
		fetch(process.env.NEXT_PUBLIC_URL + "/api/getLabels", {
			method: "POST",
		})
			.then((res) => res.json())
			.then((data) => {
				setLabels(data.labels);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				toast.error("Error fetching labels");
			});
	}, []);

	useEffect(() => {
		const DispatchedEvent = new CustomEvent("__labels__selected", {
			detail: {
				labels: selectedLabels,
			},
		});
		document.dispatchEvent(DispatchedEvent);
		console.log("%cDispatched", "color: green; font-weight: bold;");
	});

	return (
		<>
			{loading && <CircularProgress />}

			{!loading && labels.length < 1 && (
				<div className="p-4 flex bg-gray-100 rounded items-center justify-center flex-col">
					<p className="text-2xl mb-2">No labels found</p>
					<Button color="primary" onClick={() => Router.push("/labels")}>
						Create a label
					</Button>
				</div>
			)}

			{!loading && labels.length > 0 && (
				<div className="grid">
					{labels.map((label: any) => {
						return (
							<div
								className="flex items-center justify-between bg-gray-50 rounded border border-gray-300 pt-2 pb-2 p-4 mb-2"
								key={label.id}
							>
								<p>
									<b
										className={`color-${label.color} p-1 rounded inline-block mr-2`}
									></b>
									{label.name}
								</p>
								<Checkbox
									checked={selectedLabels.includes(label.id)}
									onChange={(e) => {
										if (e.target.checked) {
											setSelectedLabels([
												...new Set([...selectedLabels, label.id]),
											]);
										} else {
											setSelectedLabels(
												selectedLabels.filter((l) => l !== label.id)
											);
										}
									}}
								/>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}

export default SelectLabel;
