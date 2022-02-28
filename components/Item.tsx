import {
	CircularProgress,
	Dialog,
	DialogContent,
	IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { GoPencil, GoUnmute } from "react-icons/go";
import { MdOutlineOpenInFull } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { FaTrashRestoreAlt } from "react-icons/fa";
import EditItem from "./EditItem";
import toast from "react-hot-toast";
import Router from "next/router";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import taskLists from "markdown-it-task-lists";

interface ItemProps {
	id: string;
	title?: string;
	description: string;
	bg?: string;
	ispublic?: boolean;
	tags?: string[];
	userid?: string;
	user: string;
	trash?: boolean;
	archived?: boolean;
}

function Item({
	id,
	title,
	description,
	bg,
	ispublic,
	tags,
	userid,
	user,
	trash,
	archived,
}: ItemProps) {
	const _bg = +bg || "no";
	const isbg = _bg > 0 && _bg <= 5 ? true : false;
	const escape = (str: string) => {
		return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [labels, setLabels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	useEffect(() => {
		if (detailsOpen) {
			const _labels = fetch(
				process.env.NEXT_PUBLIC_URL + "/api/getItemLabels",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: id,
					}),
				}
			)
				.then((res) => res.json())
				.then((res) => {
					const labels = res.labels;
					if (labels.length > 0) {
						/**
						 * For each label, fetch the label name and color
						 */
						const labels_fetched = labels.map(
							async (label: { labelId: string }): Promise<any> =>
								fetch(`${process.env.NEXT_PUBLIC_URL}/api/getSingleLabel`, {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										id: label.labelId,
									}),
								})
									.then((res) => res.json())
									.then((res) => {
										return res;
									})
						);

						Promise.all(labels_fetched).then((res) => {
							setLabels(res);
						});
						console.log(labels);
					}
					setLoading(false);
				});
		}
	}, [detailsOpen]);

	return (
		<>
			<style jsx>{`
				.box:after {
					${isbg
						? `
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					width: 100%;
					background-image: url("/images/bg/${escape(_bg.toString())}.svg");
					background-size: cover;
					background-position: center;
					background-repeat: repeat;
					pointer-events: none;
					z-index: -1;
					`
						: ""}
				}
			`}</style>
			<div className="p-4 mr-4 mt-4 mb-4 inline-block relative border rounded hover:shadow-sm box">
				{ispublic && (
					<p>
						<BsEye className="icon absolute top-2 left-2 pointer-events-none z-50 text-gray-300" />
					</p>
				)}

				<h1>{title}</h1>
				<p
					className="text-gray-700 text-sm shorter"
					style={{
						whiteSpace: "nowrap",
						width: "100%",
						overflow: "hidden",
						textOverflow: "ellipsis",
						maxWidth: "200px",
					}}
				>
					{description}
				</p>

				<div className="mt-2 text-gray-600">
					<IconButton
						size="small"
						className="mr-2"
						onClick={() => setDetailsOpen(true)}
					>
						<MdOutlineOpenInFull />
					</IconButton>
					{!trash && !archived && userid === user && (
						<IconButton
							size="small"
							onClick={() => {
								setEditDialogOpen(true);
								document.addEventListener("__close__dialog", () => {
									setEditDialogOpen(false);
								});
							}}
						>
							<GoPencil />
						</IconButton>
					)}
					{trash && !archived && userid === user && (
						<IconButton
							size="small"
							onClick={() => {
								fetch(process.env.NEXT_PUBLIC_URL + "/api/restoreItem", {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										id: id,
									}),
								})
									.then((res) => res.json())
									.then((res) => {
										toast.success("Done");
										Router.push("/home");
									});
							}}
						>
							<FaTrashRestoreAlt />
						</IconButton>
					)}
					{archived && !trash && userid === user && (
						<IconButton
							size="small"
							onClick={() => {
								fetch(process.env.NEXT_PUBLIC_URL + "/api/unArchive", {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										id: id,
									}),
								})
									.then((res) => res.json())
									.then((res) => {
										toast.success("Done");
										Router.push("/home");
									});
							}}
						>
							<FaTrashRestoreAlt />
						</IconButton>
					)}
				</div>
			</div>

			<Dialog
				open={detailsOpen}
				onClose={() => setDetailsOpen(false)}
				fullWidth={true}
			>
				{loading && <CircularProgress className="m-4" />}
				<div className={`p-4 transition-all ${loading && "opacity-25"}`}>
					{labels && (
						<div className="mb-2">
							{labels.map((label: any, i: number) => {
								label = label.label;
								return (
									<div
										key={label.id + i}
										className={`color-${label.color} inline-block p-1 text-sm rounded mr-2`}
									>
										{label.name}
									</div>
								);
							})}
						</div>
					)}

					{title && <h1 className="shorter text-2xl mb-2">{title}</h1>}

					<div
						className="Markdown"
						dangerouslySetInnerHTML={{
							__html: new MarkdownIt({
								html: true,
								linkify: true,
								typographer: true,
								highlight: function (str, lang) {
									if (lang && hljs.getLanguage(lang)) {
										try {
											return hljs.highlight(str, { language: lang }).value;
										} catch (__) {}
									}

									return ""; // use external default escaping
								},
							})
								.use(taskLists)
								.render(description),
						}}
					></div>

					{tags && tags.length > 0 && (
						<div className="mt-4 mb-2">
							{tags.map((tag, i) => (
								<span
									key={i}
									className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
			</Dialog>

			<Dialog open={editDialogOpen}>
				<DialogContent>
					<EditItem id={id} />
				</DialogContent>
			</Dialog>
		</>
	);
}

export default Item;
