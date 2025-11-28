"use client";

import React, { useRef } from "react";
import { Form, Row } from "react-bootstrap";
import ButtonToken from "@/app/components/request/RequestBox/token_buttons";
import { colors } from "@/app/lib/theme";

interface RequestBoxProps {
	height?: string | number;
	textValue: string;
	setTextValue: React.Dispatch<React.SetStateAction<string>>;
}

const RequestTextBox: React.FC<RequestBoxProps> = ({
	height = "300px",
	textValue,
	setTextValue,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	return (
		<div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: height,
					gap: "0.5rem",
				}}
			>
				<Row
					className="mb-0 justify-content-center"
					style={{ flexShrink: 0 }}
				>
					<ButtonToken
						visible_buttons={3}
						textValue={textValue}
						setTextValue={setTextValue}
						textareaRef={textareaRef}
					/>
				</Row>

				<Row style={{ flexGrow: 1 }}>
					<Form.Control
						as="textarea"
						ref={textareaRef}
						value={textValue}
						onChange={(e) => setTextValue(e.target.value)}
						style={{
							height: "100%",
							resize: "none",
							backgroundColor: colors.white,
						}}
					/>
				</Row>
			</div>
		</div>
	);
};

export default RequestTextBox;
