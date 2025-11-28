"use client";

// app/settings/page.tsx
import React from "react";
import { Card } from "react-bootstrap";
import { colors, fonts } from "../lib/theme";

const AboutPage = () => {
	const headerStyle: React.CSSProperties = {
		backgroundColor: colors.light_dark,
		color: colors.white,
		fontFamily: fonts.primary,
		fontWeight: "bold",
		textAlign: "center",
	};

	return (
		<div
			style={{
				padding: "2rem",
				maxWidth: "800px",
				margin: "0 auto",
				color: colors.dark,
				fontFamily: fonts.primary,
			}}
		>
			<Card
				className="mb-4 shadow-sm"
				style={{ fontFamily: fonts.primary, color: colors.dark }}
			>
				<Card.Header as="h5" style={headerStyle}>
					About
				</Card.Header>
				<Card.Body>
					<p>
						Public Records is an open-source platform designed to
						streamline and simplify the process of requesting public
						records from government agencies. The platform
						automatically fills in relevant templates and helps
						streamline the submission process.
					</p>
				</Card.Body>
				<Card.Header as="h5" style={headerStyle}>
					Settings
				</Card.Header>
				<Card.Body>
					<p>
						The Settings page allows you to input and manage your
						personal information, which will be automatically
						included in your public records requests. This is
						optional, but it&#39;s usually recommended to provide an
						email so the records agency can follow-up (if needed).
						Note that if you are requesting records from a person,
						they can usually see who requested their information.
					</p>
					<p>
						By logging in with your Google account, you can
						seamlessly save and manage your public records requests
						using Google Sheets. This integration will add each new
						request to the specified spreadsheet. No information
						from your account is tracked.
					</p>
				</Card.Body>
				<Card.Header as="h5" style={headerStyle}>
					Records Request Tips
				</Card.Header>
				<Card.Body>
					<p>
						Based on our experience, here are some tips to get the
						most useful responses:
					</p>
					<ul
						style={{ marginLeft: "1.25rem", listStyleType: "disc" }}
					>
						<li>
							<strong>Set a Time-Frame:</strong> Specify a
							timeframe for records that you are seeking. Agencies
							will often ask for a timeframe if not specified, or
							slow collection due to lack of timeframe.
						</li>
						<li>
							<strong>Anticipate specific records:</strong>{" "}
							Agencies can&#39;t create records that don&#39;t
							exist. Try to anticipate the format of the records
							(i.e. emails, contracts, permits, invoices, report,
							etc.)
						</li>
						<li>
							<strong>Be Specific:</strong> Clearly describe the
							records you are requesting to avoid ambiguity.
							Individuals are often incentivized to interpret
							requests as &quot;narrowly&quot; as possible to
							avoid producing documents. If you want a specific
							document, then make sure to include that
							document&#39;s name in the request.
						</li>
						<li>
							<strong>Request Now, Not Later:</strong> Submit your
							request as soon as possible. Requesting is a waiting
							game, so starting the timer sooner leads to
							receiving records sooner. Don&#39;t worry about
							possible exemptions, that&#39;s the agency&#39;s job
							to determine.
						</li>
					</ul>
				</Card.Body>
			</Card>
		</div>
	);
};

export default AboutPage;
