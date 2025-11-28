"use client";

import Button from "react-bootstrap/Button";
import { ReactNode, MouseEventHandler } from "react";

interface SquareButtonProps {
	icon: ReactNode; // any JSX element, like <FaGoogle />
	variant?: string; // bootstrap variants
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
}

export default function SquareButton({
	icon,
	variant = "primary",
	onClick = () => {},
	disabled = false,
}: SquareButtonProps) {
	return (
		<>
			<style>
				{`
					.square-btn {
						width: 36px;
						height: 36px;
						padding: 0;
						border-radius: 6px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				`}
			</style>

			<Button
				variant={variant}
				onClick={onClick}
				disabled={disabled}
				className="square-btn"
			>
				{icon}
			</Button>
		</>
	);
}
