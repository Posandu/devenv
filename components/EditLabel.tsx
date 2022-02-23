import { useState, useEffect } from "react";
import {
	Button,
	ButtonBase,
	Input,
	TextField,
	CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

interface EditLabelprops {
	id: string;
}

function EditLabel({ id }: EditLabelprops) {
	const [name, setName] = useState("");
	const [color, setColor] = useState(1);
	const [loading, setLoading] = useState(false);
	const [label, setLabel] = useState<any>({ label: null });

	useEffect(() => {
		const fetchLabel = async () => {
			setLoading(true);
			const response = await fetch(
				process.env.NEXT_PUBLIC_URL + "/api/getSingleLabel",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: id }),
				}
			);
			response.json().then((data) => {
				if (data.label) {
					setLabel(data.label);
					setName(data.label.name);
					setColor(
						+data.label.color > 0 && +data.label.color <= 9
							? +data.label.color
							: 1
					);
					setLoading(false);
				} else {
					toast.error("Something went wrong");
					setLoading(false);
					setLabel({ label: null });
				}
			});
		};
		fetchLabel();
	}, []);

	return (
		<div>
			{loading && label.label == null && <CircularProgress />}
			{label.label !== null && (
				<>
					<h1 className="text-4xl shorter mb-2">Edit Label</h1>
					<TextField
						label="Name"
						variant="standard"
						fullWidth
						value={name}
						onChange={(event) => {
							setName(event.target.value);
						}}
					/>
					<div className="p-2"></div>
					<p>Color</p>
					<div className="flex mt-2">
						{[...Array(9).keys()].map((i) => {
							i += 1;
							return (
								<div className="mr-2" key={i}>
									<ButtonBase>
										<a
											href="#"
											className={`color-${i} p-4 rounded focus-visible:ring-4 ${
												color === i ? "" : "opacity-20"
											}`}
											onClick={(e) => {
												e.preventDefault();
												setColor(i);
											}}
										>
											{i}
										</a>
									</ButtonBase>
								</div>
							);
						})}
					</div>
					<div className="p-4"></div>

					<div className="flex">
						<div>
							<Button
								onClick={() => {
									setLoading(true);
									try {
										const response = fetch(
											process.env.NEXT_PUBLIC_URL + "/api/updateLabel",
											{
												method: "PATCH",
												headers: {
													"Content-Type": "application/json",
												},
												body: JSON.stringify({
													id: id,
													label: name,
													color: color,
												}),
											}
										).then((r) => {
											// If status is 200, then the label was updated successfully
											if (r.status === 200) {
												toast.success("Label updated!");
												document.dispatchEvent(new Event("__dialog_close"));
											} else {
												toast.error("Error updating label!");
												setLoading(false);
											}
										});
									} catch (e) {
										console.log(e);
										setLoading(false);
										toast.error("Error updating label!");
									}
								}}
								disabled={loading}
							>
								{loading ? <CircularProgress size={20} /> : "Update"}
							</Button>
							<Button
								onClick={() => {
									document.dispatchEvent(new CustomEvent("__dialog_close"));
								}}
								disabled={loading}
							>
								Cancel
							</Button>
						</div>
						<div className="flex-1 text-right">
							<Button
								color="error"
								onClick={() => {
									if (!confirm("Are you sure you want to delete this label?"))
										return;
									setLoading(true);
									try {
										const response = fetch(
											process.env.NEXT_PUBLIC_URL + "/api/deleteLabel",
											{
												method: "DELETE",
												headers: {
													"Content-Type": "application/json",
												},
												body: JSON.stringify({
													id: id,
												}),
											}
										).then((r) => {
											// If status is 200, then the label was deleted successfully
											if (r.status === 200) {
												toast.success("Label deleted!");
												document.dispatchEvent(new Event("__dialog_close"));
											} else {
												toast.error("Error deleting label!");
												setLoading(false);
											}
										});
									} catch (e) {
										console.log(e);
										setLoading(false);
										toast.error("Error deleting label!");
									}
								}}
								disabled={loading}
							>
								{loading ? <CircularProgress size={20} /> : "Delete"}
							</Button>
						</div>
					</div>
				</>
			)}

			{!loading && label.label === null && (
				<>
					<h1 className="text-4xl shorter mb-2">No label found</h1>
					<p>The label you are trying to edit does not exist.</p>
					<Button
						onClick={() => {
							document.dispatchEvent(new CustomEvent("__dialog_close"));
						}}
					>
						Close
					</Button>
				</>
			)}
		</div>
	);
}
export default EditLabel;


