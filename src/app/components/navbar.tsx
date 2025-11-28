"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { colors, fonts } from "@/app/lib/theme";
import Image from "next/image";
import SignInButton from "@/app/components/sign_in_button";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<nav
			className="shadow-md sticky top-0 z-50"
			style={{
				backgroundColor: colors.light_dark,
				boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // shadow
				position: "sticky",
				top: 0,
				zIndex: 50,
				borderBottom: `3px solid ${colors.dark}`, // bottom border
			}}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<Link
						href="/"
						className="flex items-center gap-2" // flex for horizontal alignment
						style={{
							color: colors.dark,
							fontWeight: "bold",
							fontSize: "1.25rem",
							textDecoration: "none",
							fontFamily: fonts.primary,
						}}
					>
						<Image
							src="/favicon.png" // path in /public
							alt="Logo"
							width={75}
							height={75}
						/>
						<span>Public Records</span>
					</Link>

					{/* Desktop menu */}
					<div className="hidden md:flex space-x-6">
						<Link
							href="/"
							style={{
								color: colors.dark,
								fontWeight: "bold",
								fontSize: "1.25rem",
								textDecoration: "none",
								fontFamily: fonts.primary,
							}}
						>
							Home
						</Link>
						<Link
							href="/about"
							style={{
								color: colors.dark,
								fontWeight: "bold",
								fontSize: "1.25rem",
								textDecoration: "none",
								fontFamily: fonts.primary,
							}}
						>
							About
						</Link>
						<Link
							href="/settings"
							style={{
								color: colors.dark,
								fontWeight: "bold",
								fontSize: "1.25rem",
								textDecoration: "none",
								fontFamily: fonts.primary,
							}}
						>
							Settings
						</Link>
						<SignInButton />
					</div>

					{/* Mobile toggle */}
					<div className="md:hidden">
						<button onClick={toggleMenu} aria-label="Toggle menu">
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isOpen && (
				<div className="md:hidden px-4 pb-4">
					<Link
						href="/"
						style={{
							color: colors.dark,
							fontWeight: "bold",
							fontSize: "1.25rem",
							textDecoration: "none",
							fontFamily: fonts.primary,
						}}
					>
						Home
					</Link>
					<Link
						href="/about"
						style={{
							color: colors.dark,
							fontWeight: "bold",
							fontSize: "1.25rem",
							textDecoration: "none",
							fontFamily: fonts.primary,
						}}
					>
						About
					</Link>
					<Link
						href="/settings"
						style={{
							color: colors.dark,
							fontWeight: "bold",
							fontSize: "1.25rem",
							textDecoration: "none",
							fontFamily: fonts.primary,
						}}
					>
						Settings
					</Link>
					<SignInButton />
				</div>
			)}
		</nav>
	);
};

export default Navbar;
