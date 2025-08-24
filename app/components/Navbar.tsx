import { Link } from "react-router";

type NavbarProps = {
    isAuthenticated: boolean;
    signOut: () => void;
};

export default function Navbar({ isAuthenticated, signOut }: NavbarProps) {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient block lg:hidden">RM</p>
                <p className="text-2xl font-bold text-gradient hidden lg:block">ResumeMate</p>
            </Link>

            <div className="flex gap-2">
                <Link to="/upload" className="primary-button w-fit">Upload Resume</Link>
                {isAuthenticated && <button className="primary-button w-fit" onClick={signOut}><p>Sign Out</p></button>}
            </div>
        </nav>
    )
}