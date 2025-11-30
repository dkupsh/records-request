import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendHome from "../send_home";
import { Agency } from "@/app/util/agency_util";

const mockAgency: Agency = {
	full_name: "Test Agency",
	short_name: "TA",
	system: "Test System",
	accepts_email: true,
	email: "test@agency.com",
	state: "California",
	website: "https://testagency.com",
	had_encampment: false,
	has_sjp: false,
	sjp_name: "",
	chancellor_name: "John Doe",
	has_police: true,
	police_chief: "Jane Smith",
	term: "quarter",
	has_undergraduate: true,
	is_system: false,
};

const defaultProps = {
	selectedAgencies: [mockAgency],
	currentAgencyIndex: 0,
	setCurrentAgencyIndex: jest.fn(),
	emailToLine: "test@agency.com",
	emailSubjectLine: "Records Request",
	emailBody: "Request body text",
	setEmailBody: jest.fn(),
	sentAgencies: [],
	sendRequest: jest.fn(),
	handleEdit: jest.fn(),
	isEmail: true,
};

describe("SendHome Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders without crashing", () => {
		render(<SendHome {...defaultProps} />);
		expect(screen.getByText("Edit")).toBeInTheDocument();
	});

	it('displays "Send" button text when isEmail is true', () => {
		render(<SendHome {...defaultProps} />);
		const buttons = screen.getAllByText("Send");
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('displays "Open" button text when isEmail is false', () => {
		render(<SendHome {...defaultProps} isEmail={false} />);
		const buttons = screen.getAllByText("Open");
		expect(buttons.length).toBeGreaterThan(0);
	});

	it("calls sendRequest when send button is clicked and agency not sent", () => {
		render(<SendHome {...defaultProps} />);
		const sendButtons = screen.getAllByRole("button", { name: /send/i });
		fireEvent.click(sendButtons[sendButtons.length - 1]);
		expect(defaultProps.sendRequest).toHaveBeenCalledTimes(1);
	});

	it("shows confirmation modal when clicking send for already sent agency", () => {
		const props = { ...defaultProps, sentAgencies: [0] };
		render(<SendHome {...props} />);
		const sendButtons = screen.getAllByRole("button", { name: /send/i });
		fireEvent.click(sendButtons[sendButtons.length - 1]);

		expect(screen.getByText("Confirm Re-send")).toBeInTheDocument();
		expect(
			screen.getByText("Already sent request. Do you want to send again?")
		).toBeInTheDocument();
	});

	it("calls sendRequest when confirming resend in modal", () => {
		const props = { ...defaultProps, sentAgencies: [0] };
		render(<SendHome {...props} />);
		const sendButtons = screen.getAllByRole("button", { name: /send/i });
		fireEvent.click(sendButtons[sendButtons.length - 1]);

		const yesButton = screen.getByText("Yes");
		fireEvent.click(yesButton);

		expect(defaultProps.sendRequest).toHaveBeenCalledTimes(1);
	});

	it("closes modal when clicking No", async () => {
		const props = { ...defaultProps, sentAgencies: [0] };
		render(<SendHome {...props} />);
		const sendButtons = screen.getAllByRole("button", { name: /send/i });
		fireEvent.click(sendButtons[sendButtons.length - 1]);

		const noButton = screen.getByText("No");
		fireEvent.click(noButton);

		await waitFor(() => {
			expect(
				screen.queryByText("Confirm Re-send")
			).not.toBeInTheDocument();
		});
		expect(defaultProps.sendRequest).not.toHaveBeenCalled();
	});

	it("calls handleEdit when Edit button is clicked", () => {
		render(<SendHome {...defaultProps} />);
		const editButton = screen.getByText("Edit");
		fireEvent.click(editButton);
		expect(defaultProps.handleEdit).toHaveBeenCalledTimes(1);
	});

	it("increments agency index when right arrow key is pressed", () => {
		const multipleAgencies = [
			mockAgency,
			{ ...mockAgency, name: "Agency 2" },
		];
		const setCurrentAgencyIndex = jest.fn();
		render(
			<SendHome
				{...defaultProps}
				selectedAgencies={multipleAgencies}
				setCurrentAgencyIndex={setCurrentAgencyIndex}
			/>
		);

		fireEvent.keyDown(window, { key: "ArrowRight" });
		expect(setCurrentAgencyIndex).toHaveBeenCalled();
	});

	it("decrements agency index when left arrow key is pressed", () => {
		const multipleAgencies = [
			mockAgency,
			{ ...mockAgency, name: "Agency 2" },
		];
		const setCurrentAgencyIndex = jest.fn();
		render(
			<SendHome
				{...defaultProps}
				selectedAgencies={multipleAgencies}
				setCurrentAgencyIndex={setCurrentAgencyIndex}
			/>
		);

		fireEvent.keyDown(window, { key: "ArrowLeft" });
		expect(setCurrentAgencyIndex).toHaveBeenCalled();
	});

	it("calls handleSend when Enter key is pressed", () => {
		render(<SendHome {...defaultProps} />);

		fireEvent.keyDown(window, { key: "Enter" });
		expect(defaultProps.sendRequest).toHaveBeenCalledTimes(1);
	});

	it("renders EmailRequest component when isEmail is true", () => {
		render(<SendHome {...defaultProps} isEmail={true} />);
		expect(screen.getByText(/To:/i)).toBeInTheDocument();
		expect(screen.getByText(/Subject:/i)).toBeInTheDocument();
	});

	it("renders WebRequest component when isEmail is false", () => {
		render(<SendHome {...defaultProps} isEmail={false} />);
		expect(screen.getByText(/Request:/i)).toBeInTheDocument();
	});
});
