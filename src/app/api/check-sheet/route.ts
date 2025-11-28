// app/api/check-sheet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authoptions";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { OAuth2Client } from "google-auth-library";

export async function POST(req: NextRequest) {
    let spreadsheetId = '';

    try {
        const session = await getServerSession(authOptions);

        if (!session || !("accessToken" in session)) {
            return NextResponse.json(
                { exists: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        const accessToken = session.accessToken as string;

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ exists: false, error: "No URL provided" });
        }

        // Extract spreadsheet ID from URL
        const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) {
            return NextResponse.json({ exists: false, error: "Invalid URL format" });
        }

        spreadsheetId = match[1];

        // Create OAuth2 client with the user's access token
        const oauth2Client = new OAuth2Client();
        oauth2Client.setCredentials({
            access_token: accessToken,
        });

        // Load the spreadsheet with OAuth2 client
        const doc = new GoogleSpreadsheet(spreadsheetId, oauth2Client);
        await doc.loadInfo();

        return NextResponse.json({
            exists: true,
            title: doc.title,
        });
    } catch (error: unknown) {
        console.error("Sheet validation error:", error);

        // Type guard for errors with status codes
        const hasStatusCode = (err: unknown): err is { response?: { status?: number }; message?: string } => {
            return typeof err === 'object' && err !== null;
        };

        // Handle specific error cases
        if (hasStatusCode(error)) {
            const statusCode = error.response?.status;

            if (statusCode === 404) {
                console.log(`[Sheet Validation] 404 - Sheet not found or no access: ${spreadsheetId}`);
                return NextResponse.json({
                    exists: false,
                    error: "Sheet not found or no access"
                });
            }

            if (statusCode === 403) {
                console.log(`[Sheet Validation] 403 - Permission denied for sheet: ${spreadsheetId}`);
                return NextResponse.json({
                    exists: false,
                    error: "No permission to access this sheet"
                });
            }
        }

        console.log(`[Sheet Validation] Unknown error for sheet: ${spreadsheetId}`, {
            errorType: typeof error,
            errorMessage: hasStatusCode(error) ? error.message : 'Unknown error',
        });

        return NextResponse.json({
            exists: false,
            error: "Failed to validate sheet"
        });
    }
}