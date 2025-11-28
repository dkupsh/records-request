"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

import SquareButton from "@/app/components/square_button";

export default function SignInButton() {
	const { data: session, status } = useSession();

	const handleSignIn = () => signIn("google", { callbackUrl: "/" });
	const handleSignOut = () => signOut({ callbackUrl: "/" });

	const handleClick = () => {
		if (status === "loading") return;
		if (session) {
			handleSignOut();
		} else {
			handleSignIn();
		}
	};

	let variant = "secondary"; // default loading
	let disabled = false;

	if (status === "loading") {
		disabled = true;
	} else if (session) {
		variant = "danger";
		disabled = false;
	} else {
		variant = "primary"; // logged out
		disabled = false;
	}

	return (
		<SquareButton
			icon={<FaGoogle size={18} />}
			variant={variant}
			onClick={handleClick}
			disabled={disabled}
		/>
	);
}
