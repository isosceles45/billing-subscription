import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';

function Navbar() {
    const [user, setUser] = useState(null);
    console.log(user);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(getAuth());
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
        console.log(user);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex items-center justify-between">
                <Link to="/" className="text-white text-lg font-bold">
                    My App
                </Link>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-white">
                                Hello, {user.displayName || 'User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
