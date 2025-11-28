"use client";

import React from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { Agency } from "@/app/util/agency_util";
import { colors, fonts } from "@/app/lib/theme";

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
	const buttonStyle = {
		backgroundColor: colors.dark,
		color: colors.light,
		fontFamily: fonts.primary,
		borderColor: colors.white,
		outline: "none",
		boxShadow: "none",
	};

	return (
		<Row className="align-items-center" style={{ width: "100%" }}>
			<Col xs="auto">
				<Button
					variant="outline-secondary"
					onClick={decrementAgencyIndex}
					style={buttonStyle}
				>
					← Prev
				</Button>
			</Col>

			<Col className="text-center">
				<Form.Label
					style={{
						fontWeight: "bold",
						margin: 0,
						fontFamily: fonts.primary,
						color: colors.dark,
					}}
				>
					{selectedAgencies[currentAgencyIndex]?.full_name ??
						"No Agency Selected"}
				</Form.Label>
			</Col>

			<Col xs="auto" className="text-end">
				<Button
					variant="outline-secondary"
					onClick={incrementAgencyIndex}
					style={buttonStyle}
				>
					Next →
				</Button>
			</Col>
		</Row>
	);
};

export default AgencyCarousel;
