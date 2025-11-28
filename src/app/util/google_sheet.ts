// src/app/util/google_sheet.ts
import { Agency, UserInfo } from "@/app/util/agency_util";

export async function appendToSheet(
  userInfo: UserInfo,
  agency: Agency,
  requestText: string
): Promise<boolean> {
  if (!userInfo.sheetUrl) {
    console.error("No Google Sheet URL provided.");
    return false;
  }

  const payload = {
    sheet_name: userInfo.sheetName,
    requester_name: userInfo.name,
    agency_name: agency.full_name,
    agency_system: agency.system,
    date_requested: new Date().toISOString().split("T")[0],
    request_text: requestText,
  };

  console.log("Sending payload to append-sheet API:", payload);

  try {
    const res = await fetch("/api/append-sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheetUrl: userInfo.sheetUrl, payload }),
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