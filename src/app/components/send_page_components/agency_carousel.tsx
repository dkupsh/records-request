"use client";

import React from "react";
import { Button, Container, Form, Col, Row } from "react-bootstrap";
import { Agency } from "@/app/util/agency_util";
import "bootstrap/dist/css/bootstrap.min.css";

interface AgencyCarouselProps {
	selectedAgencies: Agency[];
	currentAgencyIndex: number;
	incrementAgencyIndex: () => void;
	decrementAgencyIndex: () => void;
}

const AgencyCarousel: React.FC<AgencyCarouselProps> = ({
	selectedAgencies,
	currentAgencyIndex,
	incrementAgencyIndex,
	decrementAgencyIndex,
}) => {
	return (
		<Container>
			<Row className="align-items-center">
				<Col xs="auto">
					<Button
						variant="outline-secondary"
						onClick={decrementAgencyIndex}
					>
						← Prev
					</Button>
				</Col>

				<Col className="text-center">
					<Form.Label style={{ fontWeight: "bold", margin: 0 }}>
						{selectedAgencies[currentAgencyIndex]?.full_name ??
							"No Agency Selected"}
					</Form.Label>
				</Col>

				<Col xs="auto" className="text-end">
					<Button
						variant="outline-secondary"
						onClick={incrementAgencyIndex}
					>
						Next →
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default AgencyCarousel;
