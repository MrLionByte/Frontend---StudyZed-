import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState, useEffect } from 'react';

function GoogleApp() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: () => setError('Login Failed. Please try again.'),
    });

    useEffect(() => {
        if (user && user.access_token) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => setProfile(res.data))
                .catch(() => setError('Failed to fetch profile information.'));
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <div className="text-black items-center justify-center flex flex-col gap-4">
            {error && <div className="text-red-500">{error}</div>}
            {profile ? (
                <div className="flex flex-col items-center">
                    <img
                        src={profile.picture}
                        alt="Profile"
                        className="rounded-full w-16 h-16 mb-2"
                    />
                    <p>{profile.name}</p>
                    <p>{profile.email}</p>
                    <button
                        onClick={logOut}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    onClick={login}
                    className="p-2 flex items-center gap-3 bg-slate-200 rounded hover:bg-slate-300"
                >
                    Sign in with
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default GoogleApp;
