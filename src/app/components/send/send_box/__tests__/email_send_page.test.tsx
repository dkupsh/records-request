import { render, screen } from '@testing-library/react';
import EmailRequest from '../email_send_page';

const defaultProps = {
  emailToLine: 'test@example.com',
  emailSubjectLine: 'Test Subject',
  emailBody: 'This is the email body',
  setEmailBody: jest.fn(),
  handleSend: jest.fn(),
};

describe('EmailRequest Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<EmailRequest {...defaultProps} />);
    expect(screen.getByText(/To:/i)).toBeInTheDocument();
  });

  it('displays the To field with correct email', () => {
    render(<EmailRequest {...defaultProps} />);
    expect(screen.getByText(/To:/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('displays the Subject field with correct subject', () => {
    render(<EmailRequest {...defaultProps} />);
    expect(screen.getByText(/Subject:/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Subject')).toBeInTheDocument();
  });

  it('displays the Body field with correct body text', () => {
    render(<EmailRequest {...defaultProps} />);
    expect(screen.getByText(/Body:/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is the email body')).toBeInTheDocument();
  });

  it('renders all three text boxes (To, Subject, Body)', () => {
    render(<EmailRequest {...defaultProps} />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(3);
  });

  it('Body field is editable', () => {
    render(<EmailRequest {...defaultProps} />);
    const bodyTextarea = screen.getByDisplayValue('This is the email body');
    expect(bodyTextarea).not.toHaveAttribute('readOnly');
  });
});
