"use client";

import { Form } from "react-bootstrap";

interface GoogleSheetNameProps {
	sheetName: string;
	setSheetName: (url: string) => void;
	isSheetSet: boolean;
}

export default function GoogleSheetName({
	sheetName,
	setSheetName,
	isSheetSet,
}: GoogleSheetNameProps) {
	return (
		<Form.Group className="mb-3" controlId="userSheet">
			<Form.Label>Google Sheet Tab Name</Form.Label>
			<Form.Control
				placeholder=""
				value={sheetName}
				onChange={(e) => setSheetName(e.target.value)}
				disabled={!isSheetSet}
			/>
		</Form.Group>
	);
}
