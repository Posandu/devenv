import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiNote } from "react-icons/bi";
import { MdOutlineExplore, MdLabelOutline } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { HiArchive } from "react-icons/hi";
import Link from "next/link";
import { CircularProgress } from "@mui/material";

interface SidebarItemProps {
	icon: React.ReactElement;
	label: string;
	href: string;
}

function Item({ icon, label, href }: SidebarItemProps) {
	const router = useRouter();
	const isActive: (pathname: string) => boolean = (pathname) =>
		router.pathname.includes(pathname);
	const activeClasses =
		"text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 focus:bg-indigo-100 focus:border-indigo-800";
	const normalClasses = "text-gray-600 hover:bg-gray-100 focus:bg-gray-200";

	return (
		<Link href={href}>
			<a
				className={`flex transition-colors border border-transparent items-center rounded-full rounded-l-none p-4 shorter ${
					isActive(href) ? activeClasses : normalClasses
				}`}
			>
				<div className="text-xl">{icon}</div>
				<div className="flex-1 ml-4">{label}</div>
			</a>
		</Link>
	);
}

function Sidebar() {
	const router = useRouter();
	const [labels, setLabels] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const _labels = fetch(process.env.NEXT_PUBLIC_URL + "/api/getLabels", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((res) => {
				const labels = res.labels;
				setLabels(labels);
				setLoading(false);
			});
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<Item icon={<BiNote />} label="Notes" href="/home" />
			<Item icon={<MdLabelOutline />} label="Labels" href="/labels" />
			{loading ? (
				<p className="ml-6 text-sm text-gray-500">Loading labels</p>
			) : (
				<div className="flex flex-col">
					{labels.map((label) => (
						<Link
							href={`/labels/?id=${
								label.id
							}&clearCache=${Math.random().toString(36)}`}
							key={label.id}
						>
							<div className="text-sm pl-16 mt-2 cursor-pointer hover:bg-gray-100 p-2 rounded-r-full transition-all focus:bg-gray-400">
								{label.name}
							</div>
						</Link>
					))}
				</div>
			)}
			<Item icon={<MdOutlineExplore />} label="Explore" href="/explore" />
			<Item icon={<VscTrash />} label="Trash" href="/trash" />
			<Item icon={<HiArchive />} label="Archive" href="/archive" />
		</div>
	);
}

export default Sidebar;
