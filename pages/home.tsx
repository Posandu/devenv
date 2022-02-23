import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddItem from "../components/AddItem";
import Header from "../components/Header";
import MyItems from "../components/MyItems";
import Sidebar from "../components/Sidebar";

export default withPageAuthRequired(function Home({ user }) {
	const UserID = user.sub;

	const message = () => {
		let message = "Morning";
		const hour = new Date().getHours();
		if (hour < 12) {
			message = "Morning";
		}
		if (hour >= 12 && hour < 18) {
			message = "Afternoon";
		}
		if (hour >= 18) {
			message = "Evening";
		}
		return `Good ${message}`;
	};

	return (
		<>
			<Header />
			<div className="grid grid-cols-12">
				<div className="col-span-3 flex flex-col">
					<Sidebar />
				</div>
				<div className="col-span-9 p-6">
					<h1 className="shorter text-2xl mb-2">{message()}</h1>
					<AddItem />
					<div className="p-4"></div>
					<MyItems userid={UserID}/>
				</div>
			</div>
		</>
	);
});
