"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Form, Spinner } from "react-bootstrap";

interface GoogleSheetInputProps {
	sheetUrl: string;
	setSheetUrl: (url: string) => void;
	setIsSheetSet: React.Dispatch<React.SetStateAction<boolean>>;
	setSheetName: (name: string) => void;
}

export default function GoogleSheetInput({
	sheetUrl,
	setSheetUrl,
	setIsSheetSet,
	setSheetName,
}: GoogleSheetInputProps) {
	const { data: session } = useSession();
	const [sheetStatus, setSheetStatus] = useState<
		"empty" | "valid" | "invalid" | "checking"
	>("empty");

	// ----------- VALIDATE SHEET ----------
	useEffect(() => {
		// Reset if no URL
		if (!sheetUrl) {
			setSheetStatus("empty");
			setIsSheetSet(false);
			setSheetName("");
			return;
		}

		// Can't validate without session
		if (!session) {
			setSheetStatus("empty");
			setIsSheetSet(false);
			setSheetName("");
			return;
		}

		// Debounce the validation
		const delay = setTimeout(async () => {
			setSheetStatus("checking");
			setIsSheetSet(false);

			try {
				const res = await fetch("/api/check-sheet", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url: sheetUrl }),
				});

				const data = await res.json();

				// Handle authentication errors
				if (res.status === 401) {
					setSheetStatus("invalid");
					setIsSheetSet(false);
					setSheetName("");
					return;
				}

				setSheetStatus(data.exists ? "valid" : "invalid");
				setIsSheetSet(data.exists);

				if (!data.exists) {
					setSheetName("");
				}
			} catch (error) {
				console.error("Failed to validate sheet:", error);
				setIsSheetSet(false);
				setSheetName("");
				setSheetStatus("invalid");
			}
		}, 600);

		return () => clearTimeout(delay);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sheetUrl, session]); // Re-validate when session changes

	// ----------- COLOR GLOW CLASS ----------
	const glowClass =
		sheetStatus === "valid"
			? "border border-success shadow-sm"
			: sheetStatus === "invalid"
			? "border border-danger shadow-sm"
			: sheetStatus === "checking"
			? "border border-primary shadow-sm"
			: "border border-secondary";

	return (
		<Form.Group className="mb-3" controlId="userSheet">
			<Form.Label>
				Google Sheet URL
				{sheetStatus === "checking" && (
					<Spinner
						animation="border"
						size="sm"
						className="ms-2"
						variant="primary"
					/>
				)}
			</Form.Label>
			<Form.Control
				type="url"
				placeholder="https://docs.google.com/spreadsheets/d/..."
				value={sheetUrl}
				onChange={(e) => setSheetUrl(e.target.value)}
				disabled={!session}
				className={glowClass}
			/>
		</Form.Group>
	);
}
