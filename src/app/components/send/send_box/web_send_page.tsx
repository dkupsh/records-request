"use client";

import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import EmailTextBoxt from "@/app/components/send/send_box/email_text_box";
import { colors } from "@/app/lib/theme";

interface WebRequestProps {
	emailBody: string;
	setEmailBody: React.Dispatch<React.SetStateAction<string>>;
	handleSend: (e: React.FormEvent) => void;
}

const WebRequest: React.FC<WebRequestProps> = ({
	emailBody,
	setEmailBody,
	handleSend,
}) => {
	return (
		<Container fluid>
			<Row>
				<EmailTextBoxt
					label={"Request"}
					text={emailBody}
					height={22}
					editable={true}
					setText={setEmailBody}
				/>
			</Row>
			<Row
				style={{
					display: "flex",
					justifyContent: "center", // centers horizontally
				}}
			>
				<Button
					variant="primary"
					type="button"
					onClick={handleSend}
					style={{
						width: "60%", // button width
						backgroundColor: colors.blue,
					}}
				>
					Open
				</Button>
			</Row>
		</Container>
	);
};

export default WebRequest;
