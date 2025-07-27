export interface Agency {
  full_name: string;
  short_name: string;
  system: string;
  state: string;
  accepts_email: boolean;
  email: string;
  website: string;
  had_encampment: boolean;
  has_sjp: boolean;
  sjp_name: string;
  chancellor_name: string;
  has_police: boolean;
  police_chief: string;
  term: string;
  has_undergraduate: boolean;
  is_system: boolean;
}

export interface State {
  state: string;
  foia_law: string;
  template_file: string;
}

export interface UserInfo {
  name: string;
  organization: string;
  email: string;
  phone: string;
  address: string;
}

export interface FilterOption {
	label: string;
	property: keyof Agency;
	options: string[];
	default_option: string;
}

export interface FilterSelectionOptions {
	is_selected: boolean;
	selected_option: string;
}
export const agency_placeholders = [
  { label: "Full Name", value: "{{full_name}}", property: "full_name" },
  { label: "Name", value: "{{short_name}}", property: "short_name" },
  { label: "System", value: "{{system}}", property: "system" },
  { label: "State", value: "{{state}}", property: "state" },
  { label: "SJP Name", value: "{{sjp_name}}", property: "sjp_name" },
  { label: "Chancellor Name", value: "{{chancellor_name}}", property: "chancellor_name" },
  { label: "Police Chief", value: "{{police_chief}}", property: "police_chief" },
  { label: "Term", value: "{{term}}", property: "term" },
];

export const state_placeholders = [
  { label: "State FOIA Law", value: "{{state_foia_law}}", property: "foia_law" },
];

export const user_placeholders = [
  { label: "Requester Name", value: "{{requester_name}}", property: "name" },
  { label: "Requester Organization", value: "{{requester_organization}}", property: "organization" },
  { label: "Requester Email", value: "{{requester_email}}", property: "email" },
  { label: "Requester Phone", value: "{{requester_phone}}", property: "phone" },
  { label: "Requester Address", value: "{{requester_address}}", property: "address" },
];

export const placeholders = [
  ...agency_placeholders,
  ...state_placeholders,
];

export const agency_filters: FilterOption[] = [
  {
    label: "Accepts Email",
    property: "accepts_email",
    options: ["True", "False"],
    default_option: "True",
  },
  {
    label: "Has Encampment",
    property: "had_encampment",
    options: ["True", "False"],
    default_option: "True",
  },
  {
    label: "Has SJP",
    property: "has_sjp",
    options: ["True", "False"],
    default_option: "True",
  },
  {
    label: "Has Police",
    property: "has_police",
    options: ["True", "False"],
    default_option: "True",
  },
  {
    label: "Has Undergraduate",
    property: "has_undergraduate",
    options: ["True", "False"],
    default_option: "True",
  },
  {
    label: "Is System",
    property: "is_system",
    options: ["True", "False"],
    default_option: "False",
  },
  {
    label: "Term Type",
    property: "term",
    options: ["Quarter", "Semester", "Trimester", "Other"],
    default_option: "Semester",
  },
];

export function getStateForAgency(
  agency: Agency,
  stateInfo: State[]
): State {
  const found = stateInfo.find(
    (state) => state.state.toLowerCase() === agency.state.toLowerCase()
  );

  if (found) return found;
  throw new Error(`State not found for agency: ${agency.full_name} "${agency.state}"`);
}

export function generateMailtoLink(
  recipients: Agency,
  subject: string,
  body: string
): string {
  const emailList = encodeURIComponent(recipients.email);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `mailto:${emailList}?subject=${encodedSubject}&body=${encodedBody}`;
}