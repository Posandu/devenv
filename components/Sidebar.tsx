import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiNote } from "react-icons/bi";
import { MdOutlineExplore, MdLabelOutline } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { HiArchive } from "react-icons/hi";
import Link from "next/link";

interface SidebarItemProps {
	icon: React.ReactElement;
	label: string;
	href: string;
}

function Item({ icon, label, href }: SidebarItemProps) {
	const router = useRouter();
	const isActive: (pathname: string) => boolean = (pathname) =>
		router.pathname === pathname;
	const activeClasses =
		"text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 focus:bg-indigo-100 focus:border-indigo-800";

	return (
		<Link href={href}>
			<a
				className={`flex transition-colors border border-transparent items-center rounded-full rounded-l-none text-gray-600 p-4 shorter hover:bg-gray-100 focus:bg-gray-200 ${
					isActive(href) && activeClasses
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

	return (
		<div className="flex flex-col min-h-screen">
			<Item icon={<BiNote />} label="Notes" href="/home" />
			<Item icon={<MdLabelOutline />} label="Labels" href="/labels" />
			<Item icon={<MdOutlineExplore />} label="Explore" href="/explore" />
			<Item icon={<VscTrash />} label="Trash" href="/trash" />
			<Item icon={<HiArchive />} label="Archive" href="/archive" />
		</div>
	);
}

export default Sidebar;
