import "./styles.css";
import Head from "next/head";
import NextNprogress from "nextjs-progressbar";
import { useEffect, useState } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { indigo } from "@mui/material/colors";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
	palette: {
		primary: indigo,
	},
	typography: {
		fontFamily: ["Archivo", "sans-serif"].join(","),
	},
});
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<UserProvider>
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<NextNprogress color="#264568" height={2} />
				<ThemeProvider theme={theme}>
					<div className="min-h-screen overflow-x-hidden">
						<Component {...pageProps} />
					</div>
					<Toaster />
				</ThemeProvider>
			</UserProvider>
		</>
	);
}
