"use client";

import React from "react";
import { Container, Row } from "react-bootstrap";
import EmailTextBoxt from "@/app/components/send/send_box/email_text_box";

interface WebRequestProps {
	emailBody: string;
	setEmailBody: React.Dispatch<React.SetStateAction<string>>;
	handleSend: (e: React.FormEvent) => void;
}

const WebRequest: React.FC<WebRequestProps> = ({ emailBody, setEmailBody }) => {
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
		</Container>
	);
};

export default WebRequest;
