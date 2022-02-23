import { useState, useEffect } from "react";
import {
	Button,
	ButtonBase,
	Input,
	TextField,
	CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

interface AddLabelProps {
	user: string;
}

function AddLabel({ user }: AddLabelProps) {
	const [name, setName] = useState("");
	const [color, setColor] = useState(1);
	const [loading, setLoading] = useState(false);

	return (
		<div>
			<h1 className="text-4xl shorter mb-2">Add Label</h1>
			<TextField
				label="Name"
				variant="standard"
				fullWidth
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

			<Button
				onClick={() => {
					setLoading(true);
					try {
						const response = fetch(
							process.env.NEXT_PUBLIC_URL + "/api/addLabel",
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									label: name,
									color: color,
								}),
							}
						).then((r) => {
							// If status is 200, then the label was added successfully
							if (r.status === 200) {
								toast.success("Label added!");
								document.dispatchEvent(new Event("dialog_close_event"));
							} else {
								toast.error("Error adding label!");
								setLoading(false);
							}
						});
					} catch (e) {
						console.log(e);
						setLoading(false);
						toast.error("Error adding label!");
					}
				}}
				disabled={loading}
			>
				{loading ? <CircularProgress size={20} /> : "Add Label"}
			</Button>
			<Button
				onClick={() => {
					document.dispatchEvent(new CustomEvent("dialog_close_event"));
				}}
				disabled={loading}
			>
				Cancel
			</Button>
		</div>
	);
}
export default AddLabel;
