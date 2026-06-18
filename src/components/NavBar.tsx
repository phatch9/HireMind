import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { ThemeToggle } from './ThemeToggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownStyles,
    DropdownMenuSeparator,
} from '@/components/UI/DropdownMenu';
import { PersonIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';

export default function NavBar() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth/login');
    };

    if (!user) return null;

    return (
        <>
            <DropdownStyles />
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <Link to="/">
                            <h1>HireMind</h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="navbar-links hidden-mobile">
                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/applications"
                            className={`nav-link ${isActive('/applications') ? 'active' : ''}`}
                        >
                            Applications
                        </Link>
                        <Link
                            to="/kanban"
                            className={`nav-link ${isActive('/kanban') ? 'active' : ''}`}
                        >
                            Kanban
                        </Link>
                        <Link
                            to="/companies"
                            className={`nav-link ${isActive('/companies') ? 'active' : ''}`}
                        >
                            Companies
                        </Link>
                        <Link
                            to="/reminders"
                            className={`nav-link ${isActive('/reminders') ? 'active' : ''}`}
                        >
                            Reminders
                        </Link>
                        <Link
                            to="/analytics"
                            className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                        >
                            Analytics
                        </Link>
                        <Link
                            to="/ats"
                            className={`nav-link ${isActive('/ats') ? 'active' : ''}`}
                        >
                            ATS Analyzer
                        </Link>
                    </div>

                    <div className="navbar-actions">
                        <ThemeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="btn btn-ghost btn-icon" aria-label="User menu">
                                    <PersonIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-xs text-secondary pointer-events-none">
                                    {user.email}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu Trigger - Simplified for now */}
                        <div className="visible-mobile" style={{ marginLeft: 'var(--spacing-sm)' }}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="btn btn-ghost btn-icon">
                                        <HamburgerMenuIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/applications')}>Applications</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/kanban')}>Kanban</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/companies')}>Companies</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/reminders')}>Reminders</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/analytics')}>Analytics</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate('/ats')}>ATS Analyzer</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

            </nav>
        </>
    );
}
