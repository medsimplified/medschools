import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Sidebar = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div className={`sidebar ${isOpen ? 'open' : ''}`}>
				<div className="sidebar-header">
					<h2>Dashboard</h2>
					<button className="close-btn" onClick={toggleSidebar}>
						&times;
					</button>
				</div>
				<ul>
					<li className={router.pathname == '/instructor-dashboard' ? 'active' : ''}>
						<Link href="/instructor-dashboard">Dashboard</Link>
					</li>
					<li className={router.pathname == '/instructor-dashboard/profile' ? 'active' : ''}>
						<Link href="/instructor-dashboard/profile">Profile</Link>
					</li>
					<li className={router.pathname == '/instructor-dashboard/courses' ? 'active' : ''}>
						<Link href="/instructor-dashboard/courses">My Courses</Link>
					</li>
					<li className={router.pathname == '/instructor-dashboard/students' ? 'active' : ''}>
						<Link href="/instructor-dashboard/students">Students</Link>
					</li>
					<li className={router.pathname == '/instructor-dashboard/analytics' ? 'active' : ''}>
						<Link href="/instructor-dashboard/analytics">Analytics</Link>
					</li>
					<li className={router.pathname == '/instructor-dashboard/settings' ? 'active' : ''}>
						<Link href="/instructor-dashboard/settings">Settings</Link>
					</li>
					<li className={router.pathname == '/instructor-banner-videos' ? 'active' : ''}>
						<Link href="/instructor-banner-videos">Banner Videos</Link>
					</li>
				</ul>
			</div>
			<div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
		</>
	);
};

export default Sidebar;