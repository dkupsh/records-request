import { Form } from "react-bootstrap";
import { Agency } from "@/app/util/agency_util";

function CaretIcon({ isOpen }: { isOpen: boolean }) {
	return (
		<span
			style={{
				display: "inline-block",
				transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
				transition: "transform 0.2s ease",
				color: "#333", // dark caret color
				fontSize: "16px",
				lineHeight: 1,
				userSelect: "none",
			}}
		>
			▶
		</span>
	);
}

interface SelectAllProps {
	name: string;
	checked: boolean;
	onChange: () => void;
}

interface GroupOptionProps {
	name: string;
	checked: boolean;
	onChange: () => void;
	caretOpen: boolean;
	onCaretClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface AgencyOptionProps {
	agency: Agency;
	checked: boolean;
	onChange: () => void;
}

const SelectAll: React.FC<SelectAllProps> = ({ name, checked, onChange }) => {
	return (
		<div
			onClick={() => {
				onChange();
			}}
			role="checkbox"
			aria-checked={checked}
			tabIndex={0}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0.75rem 1rem",
				border: "2px solid #ccc",
				backgroundColor: "#6c757d",
				color: "white",
				userSelect: "none",
				cursor: "pointer",
				width: "100%",
				fontWeight: 700,
				opacity: 0.9,
				// Ensure names left aligned by flex:
				flexDirection: "row",
			}}
		>
			<Form.Check
				type="checkbox"
				checked={checked}
				readOnly
				style={{ pointerEvents: "none" }}
			/>
			<div style={{ flex: 1, marginLeft: "1rem", textAlign: "left" }}>
				{name}
			</div>
		</div>
	);
};

const GroupOption: React.FC<GroupOptionProps> = ({
	name,
	checked,
	onChange,
	caretOpen = false,
	onCaretClick,
}) => {
	return (
		<div
			onClick={() => {
				onChange();
			}}
			role="checkbox"
			aria-checked={checked}
			tabIndex={0}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0.75rem 1rem",
				border: "2px solid #ccc",
				backgroundColor: "#6c757d",
				color: "white",
				userSelect: "none",
				cursor: "pointer",
				width: "100%",
				fontWeight: 700,
				opacity: 0.9,
				// Ensure names left aligned by flex:
				flexDirection: "row",
			}}
		>
			<Form.Check
				type="checkbox"
				checked={checked}
				readOnly
				style={{ pointerEvents: "none" }}
			/>
			<div style={{ flex: 1, marginLeft: "1rem", textAlign: "left" }}>
				{name}
			</div>

			<button
				onClick={(e) => {
					e.stopPropagation();
					if (onCaretClick) onCaretClick(e);
				}}
				aria-label={caretOpen ? "Collapse" : "Expand"}
				style={{
					backgroundColor: "white",
					border: "1px solid #ccc",
					borderRadius: "2px",
					width: 24,
					height: 24,
					cursor: "pointer",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					padding: 0,
					flexShrink: 0,
					marginLeft: "8px",
				}}
				type="button"
			>
				<CaretIcon isOpen={caretOpen} />
			</button>
		</div>
	);
};

const AgencyOption: React.FC<AgencyOptionProps> = ({
	agency,
	checked,
	onChange,
}) => {
	return (
		<div
			onClick={() => {
				onChange();
			}}
			role="checkbox"
			aria-checked={checked}
			tabIndex={0}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0.75rem 1rem",
				border: "2px solid #ccc",
				backgroundColor: checked ? "#28a745" : "#dc3545",
				color: "white",
				userSelect: "none",
				cursor: "pointer",
				width: "100%",
				fontWeight: 500,
				opacity: 1,
				// Ensure names left aligned by flex:
				flexDirection: "row",
			}}
		>
			<Form.Check
				type="checkbox"
				checked={checked}
				readOnly
				style={{ pointerEvents: "none" }}
			/>
			<div style={{ flex: 1, marginLeft: "1rem", textAlign: "left" }}>
				{agency.full_name}
			</div>
		</div>
	);
};

export { SelectAll, GroupOption, AgencyOption };
