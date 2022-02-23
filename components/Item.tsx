import { CircularProgress, Dialog, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { GoPencil } from "react-icons/go";
import { MdOutlineOpenInFull } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ItemProps {
	id: string;
	title?: string;
	description: string;
	bg?: string;
	ispublic?: boolean;
	tags?: string[];
}

function Item({ id, title, description, bg, ispublic, tags }: ItemProps) {
	const _bg = +bg || "no";
	const isbg = _bg > 0 && _bg <= 5 ? true : false;
	const escape = (str: string) => {
		return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [labels, setLabels] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const _labels = fetch(process.env.NEXT_PUBLIC_URL + "/api/getItemlabels").then(
			(res) => res.json()
		).then((res) => {
			setLabels(res);
			setLoading(false);
		});
	}, [detailsOpen]);

	return (
		<>
			<style jsx>{`
				.box {
					${isbg
						? `
					background-image: url("/images/bg/${escape(_bg.toString())}.svg");
					background-size: cover;
					background-position: center;
					background-repeat: repeat;
					`
						: ""}
				}
			`}</style>

			<div className="p-4 mr-4 mt-4 mb-4 inline-block border rounded hover:shadow-sm box">
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
					<IconButton size="small">
						<GoPencil />
					</IconButton>
				</div>
			</div>

			<Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
				{loading && <CircularProgress className="m-4" />}
				<div className={`p-4 transition-all ${loading && "opacity-25"}`}>
					{title && <h1 className="shorter text-2xl mb-2">{title}</h1>}
					<ReactMarkdown
						rehypePlugins={[rehypeHighlight]}
						remarkPlugins={[remarkGfm]}
						className="Markdown mt-4 mb-4"
					>
						{description}
					</ReactMarkdown>

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

					<div className="mt-2 text-gray-600">
						<IconButton size="small" className="mr-2">
							<MdOutlineOpenInFull />
						</IconButton>
						<IconButton size="small">
							<GoPencil />
						</IconButton>
					</div>
				</div>
			</Dialog>
		</>
	);
}

export default Item;
