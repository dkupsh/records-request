import { render, screen } from '@testing-library/react';
import WebRequest from '../web_send_page';

const defaultProps = {
  emailBody: 'This is the request text',
  setEmailBody: jest.fn(),
  handleSend: jest.fn(),
};

describe('WebRequest Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<WebRequest {...defaultProps} />);
    expect(screen.getByText(/Request:/i)).toBeInTheDocument();
  });

  it('displays the Request field with correct text', () => {
    render(<WebRequest {...defaultProps} />);
    expect(screen.getByText(/Request:/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is the request text')).toBeInTheDocument();
  });

  it('renders a single text box', () => {
    render(<WebRequest {...defaultProps} />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(1);
  });

  it('Request field is editable', () => {
    render(<WebRequest {...defaultProps} />);
    const requestTextarea = screen.getByDisplayValue('This is the request text');
    expect(requestTextarea).not.toHaveAttribute('readOnly');
  });
});
