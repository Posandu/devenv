import {
	Button,
	IconButton,
	Tooltip,
	Dialog,
	DialogContent,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import EditLabel from "./EditLabel";

function Mylabels() {
	const [labels, setLabels] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [refresh, setRefresh] = useState<boolean>(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [labelID, setLabelID] = useState("");

	useEffect(() => {
		const fetchLabels = async () => {
			setLoaded(false);
			const response = await fetch(
				process.env.NEXT_PUBLIC_URL + "/api/getLabels",
				{
					method: "POST",
				}
			);
			response.json().then((data) => {
				setLabels(data.labels);
				setLoaded(true);
			});
		};

		fetchLabels();
	}, [refresh, editDialogOpen]);

	return (
		<>
			<Tooltip title="Refresh">
				<IconButton
					className={(!loaded ? "animate-spin" : "") + " inline-block"}
					children={<BiRefresh />}
					onClick={() => {
						setRefresh(!refresh);
					}}
				/>
			</Tooltip>

			<div className="flex flex-wrap mt-3">
				{labels &&
					labels.map((label) => (
						<button
							className={
								"bg-gray-200 p-2 mr-2 hover:opacity-80 transition-all focus-visible:outline outline-4 outline-offset-2 outline-gray-900 rounded color-" +
								label.color
							}
							key={label.id}
							onClick={() => {
								document.addEventListener("__dialog_close", () => {
									setEditDialogOpen(false);
								});
								setEditDialogOpen(true);
								setLabelID(label.id);
							}}
						>
							<h2 className="text-l">{label.name}</h2>
						</button>
					))}

				{loaded && labels.length === 0 && (
					<div className="flex items-center justify-center p-16 bg-gray-50 w-full rounded">
						<div className="text-center">
							<Image
								src="/images/empty.svg"
								alt="empty"
								width={300}
								height={200}
							/>
							<h1 className="text-2xl mt-2 mb-1">No Labels</h1>
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

			<Dialog open={editDialogOpen}>
				<DialogContent>
					<EditLabel id={labelID} />
				</DialogContent>
			</Dialog>
		</>
	);
}
export default Mylabels;
