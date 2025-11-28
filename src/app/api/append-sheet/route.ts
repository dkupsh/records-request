// app/api/append-sheet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authoptions";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { OAuth2Client } from "google-auth-library";

interface AppendPayload {
    requester_name: string;
    agency_name: string;
    sheet_name: string;
    agency_system: string;
    date_requested: string;
    request_text: string;
}

export async function POST(req: NextRequest) {
    let spreadsheetId = '';

    try {
        const session = await getServerSession(authOptions);

        if (!session || !("accessToken" in session)) {
            return NextResponse.json(
                { ok: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        const accessToken = session.accessToken as string;

        const { sheetUrl, payload } = await req.json() as {
            sheetUrl: string;
            payload: AppendPayload
        };

        if (!sheetUrl) {
            return NextResponse.json({ ok: false, error: "No sheet URL provided" });
        }

        if (!payload) {
            return NextResponse.json({ ok: false, error: "No payload provided" });
        }

        // Extract spreadsheet ID from URL
        const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) {
            return NextResponse.json({ ok: false, error: "Invalid URL format" });
        }

        spreadsheetId = match[1];

        // Create OAuth2 client with the user's access token
        const oauth2Client = new OAuth2Client();
        oauth2Client.setCredentials({
            access_token: accessToken,
        });

        // Load the spreadsheet
        const doc = new GoogleSpreadsheet(spreadsheetId, oauth2Client);
        await doc.loadInfo();

        let sheet = doc.sheetsByIndex[0];

        // Get the first sheet (or specify by title/index)
        if (payload.sheet_name != "") {
            sheet = doc.sheetsByTitle[payload.sheet_name];
            if (!sheet) {
                // Create the sheet if it doesn't exist
                sheet = await doc.addSheet({ title: payload.sheet_name });
            }
        }

        // Load cells to check if there's any data in the first row
        await sheet.loadCells('A1:E1');
        const firstRowHasData = sheet.getCell(0, 0).value !== null && sheet.getCell(0, 0).value !== '';

        const expectedHeaders = ['Requester Name', 'Agency Name', 'Agency System', 'Date Requested', 'Request Text'];

        if (!firstRowHasData) {
            await sheet.setHeaderRow(expectedHeaders);
        } else {
            // Headers exist, load them
            await sheet.loadHeaderRow();
        }

        // Append the row
        await sheet.addRow({
            'Requester Name': payload.requester_name,
            'Agency Name': payload.agency_name,
            'Agency System': payload.agency_system,
            'Date Requested': payload.date_requested,
            'Request Text': payload.request_text,
        });

        return NextResponse.json({
            ok: true,
            sheetTitle: doc.title,
        });
    } catch (error: unknown) {
        console.error("Sheet append error:", error);

        // Type guard for errors with status codes
        const hasStatusCode = (err: unknown): err is { response?: { status?: number }; message?: string } => {
            return typeof err === 'object' && err !== null;
        };

        // Handle specific error cases
        if (hasStatusCode(error)) {
            const statusCode = error.response?.status;

            if (statusCode === 404) {
                console.log(`[Sheet Append] 404 - Sheet not found: ${spreadsheetId}`);
                return NextResponse.json({
                    ok: false,
                    error: "Sheet not found or no access"
                });
            }

            if (statusCode === 403) {
                console.log(`[Sheet Append] 403 - Permission denied: ${spreadsheetId}`);
                return NextResponse.json({
                    ok: false,
                    error: "No permission to modify this sheet"
                });
            }
        }

        console.log(`[Sheet Append] Unknown error for sheet: ${spreadsheetId}`, {
            errorType: typeof error,
            errorMessage: hasStatusCode(error) ? error.message : 'Unknown error',
        });

        return NextResponse.json({
            ok: false,
            error: "Failed to append to sheet"
        });
    }
}