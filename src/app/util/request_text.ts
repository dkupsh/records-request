import { Agency, State, UserInfo, agency_placeholders, state_placeholders, user_placeholders } from "@/app/util/agency_util";

export async function processRequestText(text: string, requester: UserInfo, agency: Agency, state: State): Promise<string> {
  // Replace templated text with agency-specific information
  let processedText = replaceTemplatedText(text, requester, agency, state);

  // Add the template to the processed text
  processedText = await addTemplate(state.template_file, processedText, requester);

  return processedText;
}

export function replaceTemplatedText(text: string, requester: UserInfo, agency: Agency, state: State): string {
	if (!agency) return text;
  if (!state) return text;

	let result = text;

	for (const { value: placeholder, property } of agency_placeholders) {
		const rawValue = agency[property as keyof Agency];
		const replacement = rawValue != null ? String(rawValue) : "";
		result = result.replace(new RegExp(placeholder, "g"), replacement);
	}
  for (const { value: placeholder, property } of state_placeholders) {
    const rawValue = state[property as keyof State];
    const replacement = rawValue != null ? String(rawValue) : "";
    result = result.replace(new RegExp(placeholder, "g"), replacement);
  }
  for (const { value: placeholder, property } of user_placeholders) {
    const rawValue = requester[property as keyof UserInfo];
    const replacement = rawValue != null ? String(rawValue) : "";
    result = result.replace(new RegExp(placeholder, "g"), replacement);
  }

	return result;
}

async function addTemplate(templateFile: string, body: string, userInfo: UserInfo): Promise<string> {
  const res = await fetch(`/templates/${templateFile}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch template: ${templateFile}`);
  }
  let template = await res.text();
  template = template.replace(/{{body}}/g, body);
  template = template.replace(/{{sign_off}}/g, generateSignOff(userInfo));
  return template;
}

function generateSignOff(userInfo: UserInfo): string {
  const { name, email, phone, address } = userInfo;

  // Check if all fields are empty or whitespace
  const allEmpty = [name, email, phone, address].every(
    (field) => !field.trim()
  );

  if (allEmpty) return "";

  return `
Best,
${name}
${email}
${phone}
${address}
  `.trim();
}