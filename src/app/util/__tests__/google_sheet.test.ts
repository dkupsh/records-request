import { AppendPayload, appendToSheet } from '../google_sheet';
import { Agency, UserInfo, State } from '../agency_util';

const mockUserInfo: UserInfo = {
  name: 'John Doe',
  organization: 'Test Organization',
  email: 'john@test.com',
  phone: '123-456-7890',
  address: '123 Test St',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/test123',
  sheetName: 'TestSheet',
};

const mockAgency: Agency = {
  full_name: 'Test University',
  short_name: 'Test U',
  system: 'Test System',
  state: 'CA',
  accepts_email: true,
  email: 'test@university.edu',
  website: 'https://test.edu',
  had_encampment: true,
  has_sjp: true,
  sjp_name: 'Test SJP',
  chancellor_name: 'Dr. Chancellor',
  has_police: true,
  police_chief: 'Chief Smith',
  term: 'Semester',
  has_undergraduate: true,
  is_system: false,
};

const mockState: State = {
  state: 'CA',
  foia_law: 'California Public Records Act',
  template_file: 'ca_template.txt',
};

describe('AppendPayload', () => {
  it('creates an instance with correct properties', () => {
    const payload = new AppendPayload({
      userInfo: mockUserInfo,
      agency: mockAgency,
      state: mockState,
      dateRequested: '2024-01-01',
      requestText: 'Test request text',
    });

    expect(payload.userInfo).toEqual(mockUserInfo);
    expect(payload.agency).toEqual(mockAgency);
    expect(payload.state).toEqual(mockState);
    expect(payload.dateRequested).toBe('2024-01-01');
    expect(payload.requestText).toBe('Test request text');
  });

  it('returns correct sheet URL', () => {
    const payload = new AppendPayload({
      userInfo: mockUserInfo,
      agency: mockAgency,
      state: mockState,
      dateRequested: '2024-01-01',
      requestText: 'Test request text',
    });

    expect(payload.sheet_url()).toBe('https://docs.google.com/spreadsheets/d/test123');
  });

  it('returns correct sheet name', () => {
    const payload = new AppendPayload({
      userInfo: mockUserInfo,
      agency: mockAgency,
      state: mockState,
      dateRequested: '2024-01-01',
      requestText: 'Test request text',
    });

    expect(payload.sheet()).toBe('TestSheet');
  });

  it('generates correct headers', () => {
    const payload = new AppendPayload({
      userInfo: mockUserInfo,
      agency: mockAgency,
      state: mockState,
      dateRequested: '2024-01-01',
      requestText: 'Test request text',
    });

    const headers = payload.headers();

    expect(headers).toContain('Requester Name');
    expect(headers).toContain('Requester Organization');
    expect(headers).toContain('Requester Email');
    expect(headers).toContain('Full Name');
    expect(headers).toContain('State');
    expect(headers).toContain('State FOIA Law');
    expect(headers).toContain('Date Requested');
    expect(headers).toContain('Request Text');
  });

  it('converts to dictionary with all fields', () => {
    const payload = new AppendPayload({
      userInfo: mockUserInfo,
      agency: mockAgency,
      state: mockState,
      dateRequested: '2024-01-01',
      requestText: 'Test request text',
    });

    const dict = payload.to_dict();

    expect(dict['Requester Name']).toBe('John Doe');
    expect(dict['Requester Organization']).toBe('Test Organization');
    expect(dict['Requester Email']).toBe('john@test.com');
    expect(dict['Full Name']).toBe('Test University');
    expect(dict['Name']).toBe('Test U');
    expect(dict['State']).toBe('CA');
    expect(dict['State FOIA Law']).toBe('California Public Records Act');
    expect(dict['Date Requested']).toBe('2024-01-01');
    expect(dict['Request Text']).toBe('Test request text');
  });

  it('handles null values in to_dict', () => {
    const partialAgency: Agency = {
      ...mockAgency,
      sjp_name: null as any,
      chancellor_name: null as any,
    };

    const payload = new AppendPayload({
      userInfo: mockUserInfo,
      agency: partialAgency,
      state: mockState,
      dateRequested: '2024-01-01',
      requestText: 'Test request text',
    });

    const dict = payload.to_dict();

    expect(dict['SJP Name']).toBe('');
    expect(dict['Chancellor Name']).toBe('');
  });
});

describe('appendToSheet', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns false if no sheet URL is provided', async () => {
    const userInfoNoSheet = { ...mockUserInfo, sheetUrl: '' };
    const result = await appendToSheet(userInfoNoSheet, mockState, mockAgency, 'Test request');

    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('No Google Sheet URL provided.');
  });

  it('calls fetch with correct parameters', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ ok: true, sheetTitle: 'TestSheet' }),
    });

    await appendToSheet(mockUserInfo, mockState, mockAgency, 'Test request');

    expect(global.fetch).toHaveBeenCalledWith('/api/append-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.any(String),
    });
  });

  it('returns true on successful append', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ ok: true, sheetTitle: 'TestSheet' }),
    });

    const result = await appendToSheet(mockUserInfo, mockState, mockAgency, 'Test request');

    expect(result).toBe(true);
    expect(console.log).toHaveBeenCalledWith('Successfully appended to sheet:', 'TestSheet');
  });

  it('returns false on API error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ ok: false, error: 'API Error' }),
    });

    const result = await appendToSheet(mockUserInfo, mockState, mockAgency, 'Test request');

    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Failed to append row:', 'API Error');
  });

  it('returns false on fetch exception', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await appendToSheet(mockUserInfo, mockState, mockAgency, 'Test request');

    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Error communicating with append-sheet API:',
      expect.any(Error)
    );
  });

  it('formats date correctly in payload', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ ok: true, sheetTitle: 'TestSheet' }),
    });

    const dateSpy = jest.spyOn(Date.prototype, 'toISOString');

    await appendToSheet(mockUserInfo, mockState, mockAgency, 'Test request');

    expect(dateSpy).toHaveBeenCalled();
  });
});
