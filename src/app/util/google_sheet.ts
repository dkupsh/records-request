// src/app/util/google_sheet.ts
import { Agency, UserInfo, State, user_placeholders, agency_placeholders, state_placeholders } from "@/app/util/agency_util";




export class AppendPayload {
  userInfo: UserInfo;
  agency: Agency;
  state: State;
  dateRequested: string;
  requestText: string;

  constructor(params: {
    userInfo: UserInfo;
    agency: Agency;
    state: State;
    dateRequested: string;
    requestText: string;
  }) {
    this.userInfo = params.userInfo;
    this.agency = params.agency;
    this.state = params.state;
    this.dateRequested = params.dateRequested;
    this.requestText = params.requestText;
  }

  sheet_url() {
    return this.userInfo.sheetUrl;
  }

  sheet() {
    return this.userInfo.sheetName;
  }

  headers() {
    const headers: string[] = [];

    for (const { label } of user_placeholders) {
      headers.push(label);
    }
    for (const { label } of agency_placeholders) {
      headers.push(label);
    }
    for (const { label } of state_placeholders) {
      headers.push(label);
    }
    headers.push("Date Requested");
    headers.push("Request Text");

    return headers;
  }

  to_dict() {
    const return_dict: Record<string, string> = {};

    for (const { label, property } of agency_placeholders) {
      const rawValue = this.agency[property as keyof Agency];
      return_dict[label] = rawValue != null ? String(rawValue) : "";
    }
    for (const { label, property } of user_placeholders) {
      const rawValue = this.userInfo[property as keyof UserInfo];
      return_dict[label] = rawValue != null ? String(rawValue) : "";
    }
    for (const { label, property } of state_placeholders) {
      const rawValue = this.state[property as keyof State];
      return_dict[label] = rawValue != null ? String(rawValue) : "";
    }
    return_dict["Date Requested"] = this.dateRequested;
    return_dict["Request Text"] = this.requestText;


    return return_dict;
  }
}

export async function appendToSheet(
  userInfo: UserInfo,
  state: State,
  agency: Agency,
  requestText: string
): Promise<boolean> {
  if (!userInfo.sheetUrl) {
    console.error("No Google Sheet URL provided.");
    return false;
  }

  const payload = new AppendPayload({
    userInfo: userInfo,
    agency: agency,
    state: state,
    dateRequested: new Date().toISOString().split("T")[0],
    requestText: requestText,
  });

  console.log("Sending payload to append-sheet API:", payload);

  try {
    const res = await fetch("/api/append-sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload }),
    });

    const data = await res.json();

    if (!data.ok) {
      console.error("Failed to append row:", data.error);
      return false;
    }

    console.log("Successfully appended to sheet:", data.sheetTitle);
    return true;
  } catch (err) {
    console.error("Error communicating with append-sheet API:", err);
    return false;
  }
}