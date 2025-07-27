"use client";

import React from "react";
import { Button, Container, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RequestTextBox from "@/app/components/request_page_components/request";
import AgencyBox from "@/app/components/request_page_components/agency";
import { Agency } from "@/app/util/agency_util";

interface RequestHomeProps {
	agencies: Agency[];
	selectedAgencies: Agency[];
	setSelectedAgencies: React.Dispatch<React.SetStateAction<Agency[]>>;
	requestText: string;
	setRequestText: React.Dispatch<React.SetStateAction<string>>;
	errorModal: boolean;
	setErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
	handleSubmit: (e: React.FormEvent) => void;
}

const RequestHome: React.FC<RequestHomeProps> = ({
	agencies,
	selectedAgencies,
	setSelectedAgencies,
	requestText,
	setRequestText,
	errorModal,
	setErrorModal,
	handleSubmit,
}) => {
	const height = "600px";

	return (
		<Container fluid>
			<Row>
				<Col sm={4}>
					<AgencyBox
						agencies={agencies}
						height={height}
						selectedAgencies={selectedAgencies}
						setSelectedAgencies={setSelectedAgencies}
					/>
				</Col>
				<Col sm={8}>
					<RequestTextBox
						height={height}
						textValue={requestText}
						setTextValue={setRequestText}
					/>
				</Col>
			</Row>
			<Row>
				<Button variant="primary" type="button" onClick={handleSubmit}>
					Submit
				</Button>
			</Row>
			<Modal show={errorModal} centered>
				<Modal.Header closeButton>
					<Modal.Title>Error</Modal.Title>
				</Modal.Header>
				<Modal.Body>Request Requires at least one agency.</Modal.Body>
				<Modal.Footer>
					<Button
						variant="primary"
						onClick={() => setErrorModal(false)}
					>
						Ok
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default RequestHome;
