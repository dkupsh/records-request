"use client";

import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Clipboard } from "react-bootstrap-icons";

interface EmailTextBoxProps {
	label: string;
	text: string;
	height: number;
	editable?: boolean;
	setText?: (newText: string) => void;
}

const EmailTextBoxt: React.FC<EmailTextBoxProps> = ({
	label,
	text,
	height = 30,
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
		<Row
			style={{
				backgroundColor: "#f8f9fa",
				borderRadius: "0.5rem",
				padding: "0rem",
			}}
		>
			<Col sm={1}>
				<Form.Label
					style={{
						fontWeight: "bold",
						display: "block",
						textAlign: "left",
						lineHeight: "0px",
						padding: "0rem",
						transform: "translateY(14px)",
					}}
				>
					{label}:
				</Form.Label>
			</Col>
			<Col sm={11}>
				<div style={{ position: "relative" }}>
					<Form.Control
						as="textarea"
						value={text}
						readOnly={!editable}
						onChange={handleChange}
						rows={height}
						style={{
							resize: "none",
							paddingRight: "6rem",
						}}
					/>

					<div
						onClick={handleCopy}
						style={{
							position: "absolute",
							top: "0.5rem",
							right: "1rem",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "0.25rem",
							backgroundColor: "rgba(255,255,255,0.9)",
							padding: "0.25rem 0.5rem",
							borderRadius: "0.25rem",
							height: "28px",
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
				</div>
			</Col>
		</Row>
	);
};

export default EmailTextBoxt;
