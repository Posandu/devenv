import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MyItems from "../components/MyItems";
import Head from "next/head";

export default withPageAuthRequired(function Archive({ user }) {
	return (
		<>
			<Head>
				<title>Archive | Devenv</title>
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
					<MyItems userid={user.sub} trash={false} archived={true} />
				</div>
			</div>
		</>
	);
});
