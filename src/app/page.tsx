"use client";

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import RequestHome from "@/app/components/request_home";
import SendHome from "@/app/components/send_home";
import Cookies from "js-cookie";

import {
	Agency,
	State,
	UserInfo,
	generateMailtoLink,
	getStateForAgency,
} from "@/app/util/agency_util";
import { loadStateInfo, loadRecordsAgencies } from "@/app/util/load_util";

import {
	processRequestText,
	replaceTemplatedText,
} from "@/app/util/request_text";
import { Button } from "react-bootstrap";
import Settings from "./components/settings";

const USER_INFO_COOKIE = "user_info";

export default function HomePage() {
	const [userInfo, setUserInfo] = useState<UserInfo>({
		name: "",
		organization: "",
		email: "",
		phone: "",
		address: "",
	});
	const [agencies, setAgencies] = useState<Agency[]>([]);
	const [selectedAgencies, setSelectedAgencies] = useState<Agency[]>([]);
	const [stateInfo, setStateInfo] = useState<State[]>([]);
	const [sentAgencies, setSentAgencies] = useState<number[]>([]);
	const [currentAgencyIndex, setCurrentAgencyIndex] = useState(0);
	const [requestText, setRequestText] = useState("");
	const [showMailLinks, setShowMailLinks] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [emailToLine, setEmailToLine] = useState("");
	const [emailSubjectLine, setEmailSubjectLine] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [isEmail, setIsEmail] = useState(true);

	useEffect(() => {
		const cookieValue = Cookies.get(USER_INFO_COOKIE);
		if (cookieValue) {
			try {
				const parsed = JSON.parse(cookieValue);
				setUserInfo(parsed);
			} catch (e) {
				console.error("Failed to parse userInfo cookie", e);
			}
		}
	}, []);

	// Save to cookie whenever userInfo changes
	useEffect(() => {
		Cookies.set(USER_INFO_COOKIE, JSON.stringify(userInfo), {
			expires: 365,
		});
	}, [userInfo]);

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

	const sendRequest = () => {
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
			<div className="position-relative">
				<Button
					variant="secondary"
					size="sm"
					className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
					onClick={() => setShowSettings(true)}
				>
					<i className="bi bi-gear-fill"></i>
				</Button>
			</div>
			<Settings
				showSettings={showSettings}
				setShowSettings={setShowSettings}
				user_info={userInfo}
				setUserInfo={setUserInfo}
			/>

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
