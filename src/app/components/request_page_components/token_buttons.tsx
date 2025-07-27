"use client";

import React from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { placeholders } from "@/app/util/agency_util";

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

	return (
		<ButtonGroup>
			{visiblePlaceholders.map((ph) => (
				<Button
					key={ph.value}
					variant="outline-secondary"
					size="sm"
					onClick={() => insertPlaceholder(ph.value)}
				>
					{ph.label}
				</Button>
			))}

			{dropdownPlaceholders.length > 0 && (
				<DropdownButton
					as={ButtonGroup}
					title="More"
					variant="outline-secondary"
					size="sm"
					align="end"
					id="placeholder-dropdown"
				>
					{dropdownPlaceholders.map((ph) => (
						<Dropdown.Item
							key={ph.value}
							onClick={() => insertPlaceholder(ph.value)}
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
