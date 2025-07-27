import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";

interface UserInfo {
	name: string;
	organization: string;
	email: string;
	phone: string;
	address: string;
}

interface UserInfoFormProps {
	user_info: UserInfo;
	setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

const isValidEmail = (email: string) =>
	email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) =>
	phone === "" || /^\+?[0-9\s\-()]{7,}$/.test(phone);

const UserInfoForm: React.FC<UserInfoFormProps> = ({
	user_info,
	setUserInfo,
}) => {
	const [touched, setTouched] = useState({
		email: false,
		phone: false,
	});

	return (
		<Card className="mb-4 shadow-sm">
			<Card.Header as="h5">Requester Info</Card.Header>
			<Card.Body>
				<Form>
					<Form.Group className="mb-3" controlId="userName">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							value={user_info.name}
							onChange={(e) =>
								setUserInfo({
									...user_info,
									name: e.target.value,
								})
							}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="userOrg">
						<Form.Label>Organization</Form.Label>
						<Form.Control
							type="text"
							value={user_info.organization}
							onChange={(e) =>
								setUserInfo({
									...user_info,
									organization: e.target.value,
								})
							}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="userEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							isInvalid={
								touched.email && !isValidEmail(user_info.email)
							}
							value={user_info.email}
							onChange={(e) =>
								setUserInfo({
									...user_info,
									email: e.target.value,
								})
							}
							onBlur={() =>
								setTouched((t) => ({ ...t, email: true }))
							}
						/>
						<Form.Control.Feedback type="invalid">
							Please enter a valid email address.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="userPhone">
						<Form.Label>Phone</Form.Label>
						<Form.Control
							type="tel"
							isInvalid={
								touched.phone && !isValidPhone(user_info.phone)
							}
							value={user_info.phone}
							onChange={(e) =>
								setUserInfo({
									...user_info,
									phone: e.target.value,
								})
							}
							onBlur={() =>
								setTouched((t) => ({ ...t, phone: true }))
							}
						/>
						<Form.Control.Feedback type="invalid">
							Please enter a valid phone number.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="userAddress">
						<Form.Label>Address</Form.Label>
						<Form.Control
							type="text"
							value={user_info.address}
							onChange={(e) =>
								setUserInfo({
									...user_info,
									address: e.target.value,
								})
							}
						/>
					</Form.Group>
				</Form>
			</Card.Body>
		</Card>
	);
};

export default UserInfoForm;
