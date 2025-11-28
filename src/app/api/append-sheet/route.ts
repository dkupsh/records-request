// app/api/append-sheet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authoptions";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { OAuth2Client } from "google-auth-library";
import { AppendPayload } from "@/app/util/google_sheet";

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

        const { payload: rawPayload } = await req.json();

        if (!rawPayload) {
            return NextResponse.json({ ok: false, error: "No payload provided" });
        }

        // 2. Convert raw JSON → class instance
        const appendPayload = new AppendPayload({
            userInfo: rawPayload.userInfo,
            agency: rawPayload.agency,
            state: rawPayload.state,
            dateRequested: rawPayload.dateRequested,
            requestText: rawPayload.requestText,
        });


        const sheetUrl = appendPayload.sheet_url();

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

        const sheetName = appendPayload.sheet();

        // Get the first sheet (or specify by title/index)
        if (sheetName != "") {
            sheet = doc.sheetsByTitle[sheetName];
            if (!sheet) {
                // Create the sheet if it doesn't exist
                sheet = await doc.addSheet({ title: sheetName });
            }
        }

        // Load cells to check if there's any data in the first row
        await sheet.loadCells('A1:E1');
        const firstRowHasData = sheet.getCell(0, 0).value !== null && sheet.getCell(0, 0).value !== '';

        const possibleHeaders = appendPayload.headers();
        if (!firstRowHasData) {
            await sheet.setHeaderRow(possibleHeaders);
        } else {
            // Headers exist, load them
            await sheet.loadHeaderRow();
        }

        // Append the row
        await sheet.addRow(appendPayload.to_dict());

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