"use client";

import React, { useEffect, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AgencyCarousel from "@/app/components/send/select_agency/agency_carousel";
import { Agency } from "@/app/util/agency_util";
import WebRequest from "@/app/components/send/send_box/web_send_page";
import EmailRequest from "@/app/components/send/send_box/email_send_page";
import { colors, fonts } from "@/app/lib/theme";

interface SendHomeProps {
	selectedAgencies: Agency[];
	currentAgencyIndex: number;
	setCurrentAgencyIndex: React.Dispatch<React.SetStateAction<number>>;
	emailToLine: string;
	emailSubjectLine: string;
	emailBody: string;
	setEmailBody: React.Dispatch<React.SetStateAction<string>>;
	sentAgencies: number[];
	sendRequest: () => void;
	handleEdit: (e: React.FormEvent) => void;
	isEmail: boolean;
}

const SendHome: React.FC<SendHomeProps> = ({
	selectedAgencies,
	currentAgencyIndex,
	setCurrentAgencyIndex,
	emailToLine,
	emailSubjectLine,
	emailBody,
	setEmailBody,
	sentAgencies,
	sendRequest,
	handleEdit,
	isEmail,
}) => {
	const [showModal, setShowModal] = useState(false);

	const isCurrentAgencySent = sentAgencies.includes(currentAgencyIndex);

	const handleSend = () => {
		if (isCurrentAgencySent) {
			setShowModal(true);
		} else {
			sendRequest();
		}
	};

	const incrimentAgencyIndex = () => {
		setCurrentAgencyIndex((i) => (i + 1) % selectedAgencies.length);
	};

	const decrementAgencyIndex = () => {
		setCurrentAgencyIndex(
			(i) => (i - 1 + selectedAgencies.length) % selectedAgencies.length
		);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSend();
			}
			if (e.key === "ArrowRight") {
				e.preventDefault();
				incrimentAgencyIndex();
			}
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				decrementAgencyIndex();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	const confirmSend = () => {
		setShowModal(false);
		sendRequest();
	};

	const cancelSend = () => {
		setShowModal(false);
	};

	const sendText = isEmail ? "Send" : "Open";
	const buttonColor = isCurrentAgencySent ? colors.red : colors.blue;

	return (
		<Container fluid>
			<Row
				style={{
					alignItems: "center",
					marginTop: "1rem",
					marginBottom: "1rem",
					marginLeft: "5%",
					marginRight: "5%",
				}}
			>
				<Col style={{ flex: 1 }}>
					<AgencyCarousel
						selectedAgencies={selectedAgencies}
						currentAgencyIndex={currentAgencyIndex}
						incrementAgencyIndex={incrimentAgencyIndex}
						decrementAgencyIndex={decrementAgencyIndex}
					/>
				</Col>
				<Col xs="auto">
					<Button
						variant="primary"
						type="button"
						onClick={handleEdit}
						style={{
							backgroundColor: colors.dark,
							color: colors.light,
							fontFamily: fonts.primary,
							borderColor: colors.white,
							width: "100%",
						}}
					>
						Edit
					</Button>
				</Col>
			</Row>
			<Row
				style={{
					alignItems: "center",
					marginLeft: "5%",
					marginRight: "5%",
				}}
			>
				{isEmail && (
					<EmailRequest
						emailToLine={emailToLine}
						emailSubjectLine={emailSubjectLine}
						emailBody={emailBody}
						setEmailBody={setEmailBody}
						handleSend={handleSend}
					/>
				)}
				{!isEmail && (
					<WebRequest
						emailBody={emailBody}
						setEmailBody={setEmailBody}
						handleSend={handleSend}
					/>
				)}
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
						backgroundColor: buttonColor,
					}}
				>
					{sendText}
				</Button>
			</Row>
			<Modal show={showModal} onHide={cancelSend} centered>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Re-send</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Already sent request. Do you want to send again?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={cancelSend}>
						No
					</Button>
					<Button variant="primary" onClick={confirmSend}>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default SendHome;
