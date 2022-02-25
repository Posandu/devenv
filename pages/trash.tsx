import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MyItems from "../components/MyItems";

export default withPageAuthRequired(function Trash({ user }) {
	const UserID = user.sub;

	return (
		<>
			<Header />
			<div className="grid grid-cols-12">
				<div className="col-span-3 flex flex-col">
					<Sidebar />
				</div>
				<div className="md:col-span-9 p-6 col-span-12 overflow-auto max-h-screen">
					<MyItems userid={UserID} trash={true} />
				</div>
			</div>
		</>
	);
});
