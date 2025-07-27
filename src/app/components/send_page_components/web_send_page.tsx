"use client";

import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailTextBoxt from "@/app/components/send_page_components/email_text_box";

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
			<Row>
				<Button variant="primary" type="button" onClick={handleSend}>
					Open
				</Button>
			</Row>
		</Container>
	);
};

export default WebRequest;
