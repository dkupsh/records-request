"use client";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { UserInfo } from "@/app/util/agency_util";
import UserInfoForm from "./settings_page_components/user_info_form";

interface SettingsProps {
	showSettings: boolean;
	setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
	user_info: UserInfo;
	setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

const Settings: React.FC<SettingsProps> = ({
	showSettings,
	setShowSettings,
	user_info,
	setUserInfo,
}) => {
	return (
		<Modal
			show={showSettings}
			onHide={() => setShowSettings(false)}
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Settings</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<UserInfoForm user_info={user_info} setUserInfo={setUserInfo} />
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={() => setShowSettings(false)}
				>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default Settings;
