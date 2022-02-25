import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Button, Dialog, DialogContent } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddLabel from "../components/AddLabel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Mylabels from "../components/Labels";
import MyItems from "../components/MyItems";

export default function Labels({ user, query }): JSX.Element {
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
		// When the page location changes, we need to refresh the data
		document.addEventListener("popstate", () => {
			setLoading(true);
			setLoading(false);
		});
	}, []);

	return (
		<>
			<Header />
			<div className="grid grid-cols-12">
				<div className="col-span-3 flex flex-col">
					<Sidebar />
				</div>

				<div className="md:col-span-9 p-6 col-span-12 overflow-auto max-h-screen">
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
					<div className="p-4"></div>
					{!loading && <MyItems label={query.id} userid={user.sub} />}
				</div>

				<Dialog open={openAddDialog}>
					<DialogContent>
						<AddLabel user={user.email} />
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async ({ query }) => {
		return {
			props: {
				query: query,
			},
		};
	},
});
