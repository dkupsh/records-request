"use client";

import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import EmailTextBoxt from "@/app/components/send/send_box/email_text_box";
import { colors } from "@/app/lib/theme";

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
					height={19}
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
					Send
				</Button>
			</Row>
		</Container>
	);
};

export default EmailRequest;
