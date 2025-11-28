// app/context/UserContext.tsx
"use client";

import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from "react";

import Cookies from "js-cookie";
import { UserInfo } from "@/app/util/agency_util";

interface UserContextType {
	userInfo: UserInfo;
	setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
	isSheetSet: boolean;
	setIsSheetSet: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_INFO_COOKIE = "user_info";

export const UserProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [userInfo, setUserInfo] = useState<UserInfo>({
		name: "",
		organization: "",
		email: "",
		phone: "",
		address: "",
		sheetUrl: "",
		sheetName: "",
	});
	const [isSheetSet, setIsSheetSet] = useState(false);

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

	useEffect(() => {
		Cookies.set(USER_INFO_COOKIE, JSON.stringify(userInfo), {
			expires: 365,
		});
	}, [userInfo]);

	return (
		<UserContext.Provider
			value={{ userInfo, setUserInfo, isSheetSet, setIsSheetSet }}
		>
			{children}
		</UserContext.Provider>
	);
};

// Custom hook for easier usage
export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
