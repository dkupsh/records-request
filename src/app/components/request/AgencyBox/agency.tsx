"use client";

import React from "react";
import Row from "react-bootstrap/Row";
import { Agency } from "@/app/util/agency_util";

import CheckboxList from "@/app/components/request/AgencyBox/agency_search_box";

interface AgencyBoxProps {
	agencies: Agency[];
	height: string | number;
	selectedAgencies: Agency[];
	setSelectedAgencies: React.Dispatch<React.SetStateAction<Agency[]>>;
}

// Main component without search
const AgencyBox: React.FC<AgencyBoxProps> = ({
	agencies,
	height = "300px",
	selectedAgencies,
	setSelectedAgencies,
}) => {
	return (
		<div>
			<Row>
				<CheckboxList
					agencies={agencies}
					height={height}
					selectedAgencies={selectedAgencies}
					setSelectedAgencies={setSelectedAgencies}
				/>
			</Row>
		</div>
	);
};

export default AgencyBox;
