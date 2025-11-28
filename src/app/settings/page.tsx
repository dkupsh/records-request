"use client";

// app/settings/page.tsx
import React from "react";
import UserInfoForm from "../components/settings_page_components/user_info_form";

import { useUser } from "../components/providers/user_info_provider";
import { colors, fonts } from "../lib/theme";

const SettingsPage = () => {
	const { userInfo, setUserInfo, isSheetSet, setIsSheetSet } = useUser();

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
			<UserInfoForm
				user_info={userInfo}
				setUserInfo={setUserInfo}
				isSheetSet={isSheetSet}
				setIsSheetSet={setIsSheetSet}
			/>
		</div>
	);
};

export default SettingsPage;
