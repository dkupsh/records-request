"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { placeholders } from "@/app/util/agency_util";
import { colors, fonts } from "@/app/lib/theme";

interface ButtonTokenProps {
	visible_buttons: number;
	textValue: string;
	setTextValue: React.Dispatch<React.SetStateAction<string>>;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const ButtonToken: React.FC<ButtonTokenProps> = ({
	visible_buttons = 3,
	textValue,
	setTextValue,
	textareaRef,
}) => {
	const [hover, setHover] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const insertPlaceholder = (placeholder: string) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const before = textValue.slice(0, start);
		const after = textValue.slice(end);
		const newText = before + placeholder + after;

		setTextValue(newText);

		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(
				start + placeholder.length,
				start + placeholder.length
			);
		}, 0);
	};

	const visiblePlaceholders = placeholders.slice(0, visible_buttons);
	const dropdownPlaceholders = placeholders.slice(visible_buttons);

	// Apply theme color to the "More" button text
	useEffect(() => {
		if (dropdownRef.current) {
			const button =
				dropdownRef.current.querySelector<HTMLButtonElement>("button");
			if (button) {
				button.style.color = colors.light;
				button.style.backgroundColor = colors.dark;
				button.style.borderColor = colors.white;
				button.style.fontFamily = fonts.primary;
				button.style.outline = "none";
				button.style.boxShadow = "none";
			}
		}
	}, [dropdownRef]);

	const buttonStyle = {
		backgroundColor: colors.dark,
		color: colors.light,
		fontFamily: fonts.primary,
		borderColor: colors.white,
		outline: "none",
		boxShadow: "none",
	};

	const dropdownItemStyle = {
		backgroundColor: colors.dark,
		color: colors.light,
		fontFamily: fonts.primary,
		border: "none",
		borderBottom: `1px solid ${colors.light}`,
		outline: "none",
		boxShadow: "none",
	};

	return (
		<ButtonGroup>
			{/* Visible buttons */}
			{visiblePlaceholders.map((ph) => (
				<Button
					key={ph.value}
					variant="outline-secondary"
					size="sm"
					onClick={() => insertPlaceholder(ph.value)}
					style={buttonStyle}
					onMouseEnter={(e) =>
						(e.currentTarget.style.backgroundColor =
							colors.darkHover)
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.backgroundColor = colors.dark)
					}
					onFocus={(e) => (e.currentTarget.style.boxShadow = "none")}
				>
					{ph.label}
				</Button>
			))}

			{/* Dropdown for extra placeholders */}
			{dropdownPlaceholders.length > 0 && (
				<DropdownButton
					ref={dropdownRef}
					as={ButtonGroup}
					title="More"
					variant="outline-secondary"
					size="sm"
					align="end"
					id="placeholder-dropdown"
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
					style={{
						backgroundColor: hover ? colors.darkHover : colors.dark,
						borderColor: colors.white,
						fontFamily: fonts.primary,
						outline: "none",
						boxShadow: "none",
					}}
				>
					{dropdownPlaceholders.map((ph) => (
						<Dropdown.Item
							key={ph.value}
							onClick={() => insertPlaceholder(ph.value)}
							style={dropdownItemStyle}
							onMouseEnter={(e) =>
								(e.currentTarget.style.backgroundColor =
									colors.darkHover)
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.backgroundColor =
									colors.dark)
							}
							onFocus={(e) =>
								(e.currentTarget.style.boxShadow = "none")
							}
						>
							{ph.label}
						</Dropdown.Item>
					))}
				</DropdownButton>
			)}
		</ButtonGroup>
	);
};

export default ButtonToken;
