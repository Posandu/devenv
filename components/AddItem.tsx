import {
	IconButton,
	Input,
	Tooltip,
	Dialog,
	DialogContent,
	Button,
	Menu,
	MenuItem,
	Checkbox,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { AiFillEye, AiOutlineDelete, AiOutlineEye, AiOutlineTags } from "react-icons/ai";
import { BsListCheck, BsCode } from "react-icons/bs";
import { FiImage } from "react-icons/fi";
import { BiLabel } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Background from "./Background";
import SelectLabel from "./SelectLabels";
import toast from "react-hot-toast";

interface Iconprops {
	icon: any;
	onClick?: any;
	title: string;
}

function Icon({ icon, onClick = null, title }: Iconprops) {
	return (
		<Tooltip title={title}>
			<IconButton size="small" onClick={onClick}>
				{icon}
			</IconButton>
		</Tooltip>
	);
}

function AddItem() {
	/**
	 * Application states
	 */
	const [focused, setFocused] = useState(false);
	const [rows, setRows] = useState(6);
	const [preview, setPreview] = useState(false);
	const [delConfirmOpen, setDelConfirmOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorElBg, setAnchorElBg] = useState(null);
	const [bgSelectOpen, setBgSelectOpen] = useState(false);
	const [selectTagsOpen, setSelectTagsOpen] = useState(false);
	const [selectLabelsOpen, setSelectLabelsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [publicsetopen, setPublicsetopen] = useState(false);

	/**
	 * Value states
	 */
	const descriptionRef = useRef(null);
	const [bg, setBg] = useState<number | "no">("no");
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [labels, setLabels] = useState<string[]>([]);
	const [_public, setPublic] = useState(false);

	useEffect(() => {
		setPublic(false);
		document.addEventListener("__labels__selected", (event: any) => {
			console.log("%cLabels selected", "color: green; font-weight: bold;");
			const labels = event.detail.labels;
			setLabels(labels);
		});
	}, []);

	return (
		<div
			className={`shadow-sm ${
				focused ? "shadow-xl" : "hover:shadow"
			} max-w-2xl m-auto p-4 mt-4 border rounded`}
		>
			<div
				className={`${
					!focused ? "max-h-96 grid grid-cols-10" : "hidden"
				} transition-all`}
			>
				<div className="col-span-6">
					<a
						href="#"
						className="shorter w-full text-xl text-gray-500 cursor-text"
						onClick={(event) => {
							event.preventDefault();
							setFocused(true);
						}}
					>
						Take a note
					</a>
				</div>
				<div className="col-span-4 text-right">
					<Icon
						icon={<BsListCheck />}
						title="Insert Todo"
						onClick={() => {
							setFocused(true);
							setTimeout(() => {
								const description = descriptionRef.current!.value;
								const todo = `- [ ] Do something \n- [x] Do something else`;
								descriptionRef.current!.value = todo;
							}, 100);
						}}
					/>
					<Icon
						icon={<BsCode />}
						title="Insert Code"
						onClick={() => {
							setFocused(true);
							setTimeout(() => {
								const description = descriptionRef.current!.value;
								const code = "```\nconsole.log('Hello World');\n```";
								descriptionRef.current!.value = code;
							}, 100);
						}}
					/>
				</div>
			</div>

			<div
				className={`${focused ? "max-h-full" : "hidden"} ${
					loading ? "opacity-50 pointer-events-none" : ""
				} transition-all`}
				tabIndex={focused ? -1 : 0}
			>
				<Input
					className="w-full shorter"
					placeholder="Title (optional)"
					value={title}
					onChange={(event) => {
						setTitle(event.target.value);
					}}
				/>
				<div className="p-2"></div>
				<Input
					className="w-full"
					placeholder="Type your note here (Markdown supported)"
					fullWidth={true}
					multiline={true}
					rows={rows}
					inputRef={descriptionRef}
					onChange={(event) => {
						const value = event.target.value;
						const rows = value.split("\n").length;
						setRows(rows > 6 ? (rows > 14 ? 14 : rows) : 6);
					}}
					color="primary"
					size="small"
				/>

				<div className="flex items-center mt-2">
					<div className="flex items-center">
						<Icon
							icon={<AiOutlineEye />}
							title="Preview"
							onClick={() => {
								setPreview(!preview);
							}}
						/>

						<Icon
							icon={<BsListCheck />}
							title="Insert Todo"
							onClick={() => {
								const description = descriptionRef.current!.value;
								const todo = `\n- [ ] Do something \n- [x] Do something else`;
								descriptionRef.current!.value = description.trim() + todo;
							}}
						/>

						<Icon
							icon={<AiOutlineTags />}
							title="Insert Tags"
							onClick={() => {
								setSelectTagsOpen(true);
							}}
						/>

						<Icon
							icon={<BiLabel />}
							title="Select labels"
							onClick={() => {
								setSelectLabelsOpen(true);
							}}
						/>

						<Icon
							icon={<FiImage />}
							title="Select Background Image"
							onClick={(event) => {
								setAnchorElBg(event.target);
								setBgSelectOpen(true);
							}}
						/>

						<Icon
							icon={<AiOutlineDelete />}
							title="Delete"
							onClick={(e) => {
								setAnchorEl(e.target);
								setDelConfirmOpen(true);
							}}
						/>

						<Icon
							icon={<AiFillEye />}
							title="Select visibility"
							onClick={(e) => {
								setPublicsetopen(true);
							}}
						/>
					</div>

					<div className="flex-1 flex items-center justify-end text-right">
						<button
							disabled={loading}
							className="bg-gray-200 p-1 rounded shorter pl-4 pr-4 text-gray-800 hover:bg-gray-300 active:bg-gray-400 transition-all mr-2"
							onClick={() => {
								setLoading(true);
								const response = fetch(
									process.env.NEXT_PUBLIC_URL + "/api/addItem",
									{
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											title: title,
											description: descriptionRef.current!.value,
											tags: tags,
											labels: labels,
											bg: bg,
											_public: _public,
										}),
									}
								);
								try {
									response
										.then((res) => res.json())
										.then((res) => {
											if (res.success) {
												toast.success("Item added successfully");
												// Reset all the values
												setTitle("");
												descriptionRef.current!.value = "";
												setTags([]);
												setLabels([]);
												setBg("no");
												setFocused(false);
											} else {
												toast.error("Error adding item " + res.message || "");
											}
											setLoading(false);
										});
								} catch (error) {
									toast.error("Error adding item");
									setLoading(false);
								}
							}}
						>
							Add
						</button>
					</div>
				</div>
			</div>

			<Dialog
				open={preview}
				onClose={() => {
					setPreview(false);
				}}
			>
				<DialogContent>
					<div className="text-gray-800 text-xl mb-2">Preview</div>
					<div className="Markdown border border-gray-100 p-4 rounded">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeHighlight]}
						>
							{(descriptionRef.current && descriptionRef.current.value) ||
								"Nothing to preview"}
						</ReactMarkdown>
					</div>
					<div className="p-2"></div>
					<Button
						onClick={() => {
							setPreview(false);
						}}
					>
						Exit Preview
					</Button>
				</DialogContent>
			</Dialog>

			<Dialog
				open={selectTagsOpen}
				onClose={() => {
					setSelectTagsOpen(false);
				}}
			>
				<DialogContent>
					<div className="text-gray-800 text-xl mb-2">Add / Edit tags</div>
					<p>Type tags seperated with commas</p>
					<Input
						className="w-full"
						placeholder="haha,some,tags"
						fullWidth={true}
						value={tags.join(",")}
						onChange={(event) => {
							const tags = [...new Set(event.target.value.split(","))];
							setTags(tags);
						}}
					/>
					<div className="p-2"></div>
					<Button
						onClick={() => {
							setSelectTagsOpen(false);
						}}
					>
						Done
					</Button>
				</DialogContent>
			</Dialog>

			<Dialog
				open={selectLabelsOpen}
				onClose={() => {
					setSelectLabelsOpen(false);
				}}
			>
				<DialogContent>
					<div className="text-gray-800 text-xl mb-2">Add / Edit labels</div>
					<SelectLabel selected={labels} />
				</DialogContent>
			</Dialog>

			<Dialog
				open={publicsetopen}
				onClose={() => {
					setPublicsetopen(false);
				}}
			>
				<DialogContent>
					<p>Is public?</p>
					<Checkbox
						checked={_public}
						onChange={(event) => {
							setPublic(event.target.checked);
						}}
					/>
				</DialogContent>
			</Dialog>

			<Menu
				open={bgSelectOpen}
				anchorEl={anchorElBg}
				onClose={() => {
					setBgSelectOpen(false);
				}}
			>
				{[...Array(4)].map((_, i) => {
					i += 1;
					return (
						<MenuItem
							key={i}
							onClick={() => {
								setBgSelectOpen(false);
								setBg(i);
							}}
						>
							<p className="text-gray-600 text-xs">
								{bg === i ? (
									<>
										Current
										<br />
									</>
								) : (
									""
								)}
								<Background id={i} size={4} />
							</p>
						</MenuItem>
					);
				})}

				<MenuItem
					onClick={() => {
						setBgSelectOpen(false);
						setBg("no");
					}}
				>
					<p className={bg === "no" ? "bg-gray-300" : ""}>No background</p>
				</MenuItem>
			</Menu>

			<Menu
				open={delConfirmOpen}
				onClose={() => setDelConfirmOpen(false)}
				anchorEl={anchorEl}
			>
				<MenuItem disabled={true}>Confirm</MenuItem>

				<MenuItem
					onClick={(e) => {
						setDelConfirmOpen(false);
						setLabels([]);
						setTags([]);
						setBg("no");
						setTitle("");
						descriptionRef.current!.value = "";
						setFocused(false);
					}}
				>
					Delete
				</MenuItem>
			</Menu>
		</div>
	);
}

export default AddItem;
