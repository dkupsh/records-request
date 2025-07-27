"use client";

import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailTextBoxt from "@/app/components/send_page_components/email_text_box";

interface EmailRequesstProps {
	emailToLine: string;
	emailSubjectLine: string;
	emailBody: string;
	setEmailBody: React.Dispatch<React.SetStateAction<string>>;
	handleSend: (e: React.FormEvent) => void;
}

const EmailRequest: React.FC<EmailRequesstProps> = ({
	emailToLine,
	emailSubjectLine,
	emailBody,
	setEmailBody,
	handleSend,
}) => {
	return (
		<Container fluid>
			<Row>
				<EmailTextBoxt label={"To"} text={emailToLine} height={1} />
			</Row>
			<Row>
				<EmailTextBoxt
					label={"Subject"}
					text={emailSubjectLine}
					height={1}
				/>
			</Row>
			<Row>
				<EmailTextBoxt
					label={"Body"}
					text={emailBody}
					height={20}
					editable={true}
					setText={setEmailBody}
				/>
			</Row>
			<Row>
				<Button variant="primary" type="button" onClick={handleSend}>
					Send
				</Button>
			</Row>
		</Container>
	);
};

export default EmailRequest;
