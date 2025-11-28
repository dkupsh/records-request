"use client";

import { colors, fonts } from "@/app/lib/theme";
import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Clipboard } from "react-bootstrap-icons";

interface EmailTextBoxProps {
	label: string;
	text: string;
	height?: number; // number of rows for textarea, >1 for body
	editable?: boolean;
	setText?: (newText: string) => void;
}

const EmailTextBox: React.FC<EmailTextBoxProps> = ({
	label,
	text,
	height = 1, // default 1 for single-line fields like "To:"
	editable = false,
	setText,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (editable && setText) {
			setText(e.target.value);
		}
	};

	return (
		<Form.Group
			as={Row}
			style={{
				marginBottom: "1rem",
				fontFamily: fonts.primary,
			}}
		>
			{/* Label column */}
			<Col xs={12} sm={2}>
				<Form.Label
					style={{
						fontWeight: "bold",
						display: "block",
						textAlign: "right",
						paddingRight: "1rem",
						lineHeight: "1.5rem",
					}}
				>
					{label}:
				</Form.Label>
			</Col>

			{/* Input or textarea */}
			<Col xs={12} sm={10} style={{ position: "relative" }}>
				{height > 1 ? (
					<Form.Control
						as="textarea"
						value={text}
						readOnly={!editable}
						onChange={handleChange}
						rows={height}
						style={{
							width: "100%",
							resize: "none",
							paddingRight: "4rem",
							backgroundColor: colors.white,
							color: colors.dark,
							border: `1px solid ${colors.dark}`,
							borderRadius: "0.5rem",
						}}
					/>
				) : (
					<Form.Control
						type="text"
						value={text}
						readOnly={!editable}
						onChange={handleChange}
						style={{
							width: "100%",
							paddingRight: "4rem",
							backgroundColor: colors.white,
							color: colors.dark,
							border: `1px solid ${colors.dark}`,
							borderRadius: "0.5rem",
						}}
					/>
				)}

				{/* Copy button */}
				<div
					onClick={handleCopy}
					style={{
						position: "absolute",
						top: height > 1 ? "0.5rem" : "0.1rem",
						right: "0.5rem",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "0.25rem",
						backgroundColor: "transparent",
						padding: "0.25rem 0.5rem",
						borderRadius: "0.25rem",
						zIndex: 2,
					}}
				>
					<Clipboard size={16} />
					{copied && (
						<span
							style={{
								fontSize: "0.75rem",
								color: "green",
								whiteSpace: "nowrap",
							}}
						>
							Copied!
						</span>
					)}
				</div>
			</Col>
		</Form.Group>
	);
};

export default EmailTextBox;
