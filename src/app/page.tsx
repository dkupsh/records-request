"use client";

import React, { useState, useEffect, useRef } from "react";

import RequestHome from "@/app/components/request/request_home";
import SendHome from "@/app/components/send/send_home";

import {
	Agency,
	State,
	generateMailtoLink,
	getStateForAgency,
} from "@/app/util/agency_util";

import { loadStateInfo, loadRecordsAgencies } from "@/app/util/load_util";

import {
	processRequestText,
	formatRequestText,
	replaceTemplatedText,
} from "@/app/util/request_text";
import { appendToSheet } from "./util/google_sheet";
import { useUser } from "./components/providers/user_info_provider";

export default function HomePage() {
	const [agencies, setAgencies] = useState<Agency[]>([]);
	const [selectedAgencies, setSelectedAgencies] = useState<Agency[]>([]);
	const [stateInfo, setStateInfo] = useState<State[]>([]);
	const [sentAgencies, setSentAgencies] = useState<number[]>([]);
	const [currentAgencyIndex, setCurrentAgencyIndex] = useState(0);
	const [requestText, setRequestText] = useState("");
	const [showMailLinks, setShowMailLinks] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [emailToLine, setEmailToLine] = useState("");
	const [emailSubjectLine, setEmailSubjectLine] = useState("");
	const [formattedRequestText, setFormattedRequestText] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [isEmail, setIsEmail] = useState(true);

	const { userInfo, isSheetSet } = useUser();

	useEffect(() => {
		loadStateInfo().then(setStateInfo);
		loadRecordsAgencies().then(setAgencies);
	}, []);

	useEffect(() => {
		if (selectedAgencies.length === 0) return;
		if (currentAgencyIndex >= selectedAgencies.length) return;

		const agency = selectedAgencies[currentAgencyIndex];
		setIsEmail(agency.accepts_email);
	}, [currentAgencyIndex, selectedAgencies]);

	useEffect(() => {
		if (selectedAgencies.length === 0) return;
		if (currentAgencyIndex >= selectedAgencies.length) return;
		const currentAgency = selectedAgencies[currentAgencyIndex];
		const currentState = getStateForAgency(currentAgency, stateInfo);
		setEmailToLine(currentAgency.accepts_email ? currentAgency.email : "");
		setEmailSubjectLine(
			replaceTemplatedText(
				"{{state_foia_law}} Request",
				userInfo,
				currentAgency,
				currentState
			)
		);
		processRequestText(
			requestText,
			userInfo,
			currentAgency,
			currentState
		).then((completedTemplate) => {
			setEmailBody(completedTemplate);
		});
		formatRequestText(
			requestText,
			userInfo,
			currentAgency,
			currentState
		).then((formattedText) => {
			setFormattedRequestText(formattedText);
		});
	}, [
		currentAgencyIndex,
		selectedAgencies,
		userInfo,
		stateInfo,
		requestText,
	]);

	useEffect(() => {
		setSelectedAgencies((prev) =>
			[...prev].sort((a, b) => {
				if (a.accepts_email !== b.accepts_email) {
					return a.accepts_email ? -1 : 1;
				}
				if (a.system !== b.system) {
					return a.system.localeCompare(b.system);
				}
				return a.full_name.localeCompare(b.full_name);
			})
		);
	}, [selectedAgencies.length]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedAgencies.length === 0) {
			setErrorModal(true);
			return;
		}

		setShowMailLinks(true);
		setSentAgencies([]);
	};

	const handleEdit = (e: React.FormEvent) => {
		e.preventDefault();
		setShowMailLinks(false);
		setSentAgencies([]);
		setCurrentAgencyIndex(0);
	};

	const sendRequest = async () => {
		if (isEmail) {
			const mailToLink = generateMailtoLink(
				selectedAgencies[currentAgencyIndex],
				emailSubjectLine,
				emailBody
			);

			window.location.href = mailToLink;
		} else {
			const agency = selectedAgencies[currentAgencyIndex];
			if (agency?.website) {
				window.open(agency.website, "_blank");
			} else {
				alert("No website available for this agency.");
			}
		}
		setSentAgencies((prev) =>
			prev.includes(currentAgencyIndex)
				? prev
				: [...prev, currentAgencyIndex]
		);

		if (isSheetSet) {
			const currentAgency = selectedAgencies[currentAgencyIndex];
			const currentState = getStateForAgency(currentAgency, stateInfo);

			await appendToSheet(
				userInfo,
				currentState,
				currentAgency,
				formattedRequestText
			);
		}
	};

	const startIndexRef = useRef(currentAgencyIndex);

	useEffect(() => {
		if (sentAgencies.length === selectedAgencies.length) return;

		const total = selectedAgencies.length;
		const start = startIndexRef.current % total;

		for (let offset = 0; offset < total; offset++) {
			const i = (start + offset) % total;
			if (!sentAgencies.includes(i)) {
				setCurrentAgencyIndex(i);
				startIndexRef.current = i + 1; // increment starting point for next time
				break;
			}
		}
	}, [sentAgencies, selectedAgencies]);

	return (
		<div>
			{!showMailLinks && (
				<RequestHome
					agencies={agencies}
					selectedAgencies={selectedAgencies}
					setSelectedAgencies={setSelectedAgencies}
					requestText={requestText}
					setRequestText={setRequestText}
					errorModal={errorModal}
					setErrorModal={setErrorModal}
					handleSubmit={handleSubmit}
				/>
			)}
			{showMailLinks && (
				<SendHome
					selectedAgencies={selectedAgencies}
					currentAgencyIndex={currentAgencyIndex}
					setCurrentAgencyIndex={setCurrentAgencyIndex}
					emailToLine={emailToLine}
					emailSubjectLine={emailSubjectLine}
					emailBody={emailBody}
					setEmailBody={setEmailBody}
					sentAgencies={sentAgencies}
					sendRequest={sendRequest}
					handleEdit={handleEdit}
					isEmail={isEmail}
				/>
			)}
		</div>
	);
}
