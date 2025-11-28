// src/app/layout.tsx
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { SessionProvider } from "@/app/components/providers/session_wrapper";
import { UserProvider } from "./components/providers/user_info_provider";
import { colors } from "./lib/theme";

export const metadata: Metadata = {
	title: "Records Request",
	description: "Public Records Request Webapp",
	icons: {
		icon: "/favicon.png", // your PNG favicon
		shortcut: "/favicon.png",
		apple: "/favicon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className=" text-black"
				style={{
					backgroundColor: colors.light,
				}}
			>
				<SessionProvider>
					<UserProvider>
						<Navbar />
						{children}
					</UserProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
