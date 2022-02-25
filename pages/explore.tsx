import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ExploreAll from "../components/Explore";

export default withPageAuthRequired(function Explore({ user }) {
	return (
		<>
			<Header />
			<div className="grid grid-cols-12">
				<div className="col-span-3 flex flex-col">
					<Sidebar />
				</div>
				<div className="md:col-span-9 p-6 col-span-12 overflow-auto max-h-screen">
					<ExploreAll me={user.sub}/>
				</div>
			</div>
		</>
	);
});
