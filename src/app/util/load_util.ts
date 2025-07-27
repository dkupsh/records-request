import Papa from "papaparse";
import { Agency, State } from "@/app/util/agency_util";

export async function loadTemplate(templateFile: string): Promise<string> {
  const response = await fetch(`/templates/${templateFile}`);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${templateFile}`);
  }
  return await response.text();
}

export async function loadStateInfo(): Promise<State[]> {
  const res = await fetch("/state-info.csv"); // adjust the path as needed
  const csvText = await res.text();

  const parsed = Papa.parse<State>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  // Optional: sort by name ascending
  const sorted = parsed.data.sort((a, b) => a.state.localeCompare(b.state));

  return sorted;
}

export async function loadRecordsAgencies(): Promise<Agency[]> {
  const res = await fetch("/records-agencies.csv");
  const csvText = await res.text();

  const parsed = Papa.parse<Agency>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => {
      const trimmed = value.trim().toLowerCase();
      if (trimmed === "true") return true;
      if (trimmed === "false") return false;
      return value.trim();
    },
  });

  const sorted = parsed.data.sort((a, b) => {
    if (b.accepts_email !== a.accepts_email)
      return Number(b.accepts_email) - Number(a.accepts_email);
    if (a.state !== b.state) return a.state.localeCompare(b.state);
    if (a.system !== b.system) return a.system.localeCompare(b.system);
    return a.full_name.localeCompare(b.full_name);
  });

  return sorted;
}
