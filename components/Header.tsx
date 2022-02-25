import React from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import {
	Button,
	Dialog,
	DialogContent,
	IconButton,
	Menu,
	MenuItem,
} from "@mui/material";
import { MdMenu } from "react-icons/md";

const Header: React.FC = () => {
	const router = useRouter();
	const { user, error, isLoading } = useUser();
	const [logoutConfirm, setLogoutConfirm] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);

	return (
		<header className="flex justify-center align-middle border-b p-4 pb-2 pt-2 border-gray-200">
			<div className="flex-1 flex items-center">
				<span className="text-2xl short m-0 font-bold shorter text-gray-600">
					Devenv
				</span>
			</div>
			<div className="flex-1 flex items-center justify-end">
				{user && (
					<>
						{
							/** If mobile */
							typeof window !== "undefined" && window.innerWidth < 768 && (
								<IconButton
									onClick={() => {
										document
											.querySelector("#sidebar____")
											?.classList.toggle("hidden");
									}}
								>
									<MdMenu />
								</IconButton>
							)
						}
						<button
							className="m-0 p-0 ml-4 overflow-hidden rounded-full hover:ring-2 flex justify-center items-center focus:ring-4 focus:shadow-2xl active:scale-90 transition-all"
							onClick={(event) => setAnchorEl(event.target)}
						>
							<img
								src={user.picture}
								alt={user.name}
								className="w-8 h-8 rounded-full"
							/>
						</button>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={() => setAnchorEl(null)}
						>
							<div className="p-4 pt-2">
								<h2 className="text-sm text-gray-400">{user.name}</h2>
							</div>

							<MenuItem
								onClick={() => {
									setLogoutConfirm(true);
								}}
							>
								Logout
							</MenuItem>
						</Menu>
					</>
				)}
			</div>

			<Dialog open={logoutConfirm}>
				<DialogContent>
					<h1 className="text-xl mb-2">Log out?</h1>
					<p className="text-gray-600 mb-2">
						Are you sure you want to log out?
					</p>
					<div className="p-2"></div>
					<Button
						color="error"
						onClick={() => {
							setLogoutConfirm(false);
							router.push("/api/auth/logout");
						}}
					>
						Yes
					</Button>
					<Button onClick={() => setLogoutConfirm(false)}>No</Button>
				</DialogContent>
			</Dialog>
		</header>
	);
};

export default Header;
