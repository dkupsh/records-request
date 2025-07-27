import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { FilterOption } from "@/app/util/agency_util";

interface FilterNodeProps {
	filter: FilterOption;
	checked: boolean;
	value: string;
	setValue: (filter: FilterOption, value: string) => void;
	onChange: (filter: FilterOption) => void;
}
const FilterNode: React.FC<FilterNodeProps> = ({
	filter,
	checked,
	value,
	setValue,
	onChange,
}) => {
	const handleCheckboxChange = () => onChange(filter);

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setValue(filter, e.target.value);

	return (
		<Row className="align-items-center mb-2">
			<Col xs="auto">
				<Form.Check
					type="checkbox"
					id={filter.property}
					label={filter.label}
					checked={checked}
					onChange={handleCheckboxChange}
				/>
			</Col>
			{filter.options?.length > 0 && (
				<Col>
					<Form.Select
						size="sm"
						value={value ?? ""}
						onChange={handleSelectChange}
					>
						{filter.options.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Form.Select>
				</Col>
			)}
		</Row>
	);
};

export default FilterNode;
