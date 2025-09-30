import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

// Icon Components
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ClientsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const AccountManagerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path></svg>;

const Sidebar = () => {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isSuperAdmin = user?.role === 'superAdmin';
    const isMfaEnabled = user?.is_mfa_enabled;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Logo" className="sidebar-logo" />
                <span>{isSuperAdmin ? 'Super Admin' : (isAdmin ? 'Admin Portal' : 'Client Portal')}</span>
            </div>
            
            {isMfaEnabled ? (
                <nav className="sidebar-nav">
                    <ul>
                        <li><NavLink to="/dashboard"><DashboardIcon /> Dashboard</NavLink></li>
                        
                        {/* Show Clients link for Admins and Viewers */}
                        {!isSuperAdmin && (
                            <li><NavLink to="/clients" end><ClientsIcon /> Show Clients</NavLink></li>
                        )}
                        
                        {isSuperAdmin && (
                            <>
                                <li><NavLink to="/clients" end><ClientsIcon /> Show Clients</NavLink></li> {/* <-- ADDED FOR SUPER ADMIN */}
                                <li><NavLink to="/manage-users"><UserIcon /> Manage Users</NavLink></li>
                                <li><NavLink to="/account-managers"><AccountManagerIcon /> Account Managers</NavLink></li>
                            </>
                        )}
                        
                        {isAdmin && (
                            <li><NavLink to="/clients/create"><CreateIcon /> Create Client</NavLink></li>
                        )}
                        
                        {isSuperAdmin ? (
                            <li><NavLink to="/settings/superadmin-mfa"><SettingsIcon /> Settings</NavLink></li>
                        ) : isAdmin ? (
                            <li><NavLink to="/settings/mfa"><SettingsIcon /> Settings</NavLink></li>
                        ) : (
                            <li><NavLink to="/settings/viewer-mfa"><SettingsIcon /> MFA Setup</NavLink></li>
                        )}
                    </ul>
                </nav>
            ) : (
                <div style={{ padding: '20px', textAlign: 'center', flexGrow: 1 }}>
                    <p>Please enable MFA in Settings to access portal features.</p>
                </div>
            )}
            
            <div className="sidebar-footer">
                <div className="user-info">Welcome, {user?.username || 'User'}!</div>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
            </div>
        </aside>
    );
};

export default Sidebar;