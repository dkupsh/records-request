"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<nav className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<Link href="/" className="text-xl font-bold text-blue-600">
						Public Records Mass Request
					</Link>

					{/* Desktop menu */}
					<div className="hidden md:flex space-x-6">
						<Link href="/" className="hover:text-blue-600">
							Home
						</Link>
						{/*<Link href="/about" className="hover:text-blue-600">About</Link>*/}
						{/*<Link href="/services" className="hover:text-blue-600">Services</Link>*/}
						{/*<Link href="/contact" className="hover:text-blue-600">Contact</Link>*/}
					</div>

					{/* Mobile toggle */}
					<div className="md:hidden">
						<button onClick={toggleMenu} aria-label="Toggle menu">
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isOpen && (
				<div className="md:hidden px-4 pb-4">
					<Link href="/" className="block py-2 hover:text-blue-600">
						Home
					</Link>
					{/*<Link href="/about" className="block py-2 hover:text-blue-600">About</Link>
          <Link href="/services" className="block py-2 hover:text-blue-600">Services</Link>
          <Link href="/contact" className="block py-2 hover:text-blue-600">Contact</Link>*/}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
