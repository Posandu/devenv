import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Button, Dialog, DialogContent } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddLabel from "../components/AddLabel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Mylabels from "../components/Labels";

export default withPageAuthRequired(function Labels({ user }): JSX.Element {
	const [openAddDialog, setOpenAddDialog] = useState(false);

	return (
		<>
			<Header />
			<div className="grid grid-cols-12">
				<div className="col-span-3 flex flex-col">
					<Sidebar />
				</div>
				<div className="col-span-9 p-6">
					<div className="flex align-middle">
						<div className="flex-1">
							<h1 className="shorter text-4xl">Labels</h1>
							<p className="mt-2 text-gray-600">
								Organize your items with labels.
							</p>
						</div>

						<Button
							onClick={() => {
								setOpenAddDialog(true);
								document.addEventListener("dialog_close_event", () => {
									setOpenAddDialog(false);
								});
							}}
						>
							Add Label
						</Button>
					</div>

					<h2 className="text-2xl mt-4 mb-4 inline-block mr-2">My Labels</h2>
					<Mylabels />
				</div>

				<Dialog open={openAddDialog}>
					<DialogContent>
						<AddLabel user={user.email} />
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
});


