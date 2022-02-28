import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ExploreAll from "../components/Explore";
import Head from "next/head";

export default withPageAuthRequired(function Explore({ user }) {
	return (
		<>
			<Head>
				<title>Explore | Devenv</title>
			</Head>
			<Header />
			<div className="grid grid-cols-12">
				<div className="col-span-3 flex flex-col">
					<Sidebar />
				</div>
				<div
					className="md:col-span-9 p-6 col-span-12 overflow-auto"
					style={{ maxHeight: "calc(100vh - 50px)" }}
				>
					<ExploreAll me={user.sub} />
				</div>
			</div>
		</>
	);
});
