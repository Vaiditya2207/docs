import React, { useEffect, useState } from 'react';
import googleLogo from '../images/google.svg';
import image from '../images/image.jpg';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import Loader from '../loader/Loader.jsx';

const AuthComponent = (props) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (props.user.isLogged) {
            navigate('/');
        }
    }, [props.user.isLogged, navigate]);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleAuth = async () => {
        if (isLogin) {
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid; // Get the user's UID
                localStorage.setItem('isLogged', true);
                localStorage.setItem('token', uid); // Store the UID in local storage
                props.user.setIsLogged(true);
                props.user.setToken(uid);
                navigate('/');
            } catch (error) {
                console.error("Error during authentication:", error);
                alert(error.message);
            }
        } else {
            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid; // Get the user's UID
                localStorage.setItem('isLogged', true);
                localStorage.setItem('token', uid); // Store the UID in local storage
                props.user.setIsLogged(true);
                props.user.setToken(uid);
                navigate('/');
            } catch (error) {
                console.error("Error during registration:", error);
                alert(error.message);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const uid = result.user.uid; // Get the user's UID
            localStorage.setItem('isLogged', true);
            localStorage.setItem('token', uid); // Store the UID in local storage
            props.user.setIsLogged(true);
            props.user.setToken(uid);
            navigate('/');
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            alert(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                <div className="flex flex-col justify-center p-8 md:p-14">
                    <span className="mb-3 text-4xl font-bold">{isLogin ? 'Welcome back' : 'Create Account'}</span>
                    <span className="font-light text-gray-400 mb-8">
                        {isLogin ? 'Welcome back! Please enter your details' : 'Please enter your details to sign up'}
                    </span>

                    {isLogin ? (
                        <div style={{ width: "360px", height: "300px" }}>
                            <div className="py-4">
                                <span className="mb-2 text-md">Email</span>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="py-4">
                                <span className="mb-2 text-md">Password</span>
                                <input
                                    type="password"
                                    name="pass"
                                    id="pass"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="py-2">
                                <span className="mb-1 text-md">Name</span>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="py-2">
                                <span className="mb-1 text-md">Email</span>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="py-2">
                                <span className="mb-1 text-md">Password</span>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between w-full py-4">
                                <div className="mr-24">
                                    <input type="checkbox" name="terms" id="terms" className="mr-2" />
                                    <span className="text-md">I agree to the terms and conditions</span>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleAuth}
                        className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                    >
                        {isLogin ? 'Sign in' : 'Sign up'}
                    </button>

                    <button
                        onClick={handleGoogleSignIn}
                        className="cursor-pointer w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
                    >
                        <img src={googleLogo} alt="Google" className="w-6 h-6 inline mr-2" />
                        {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                    </button>

                    <div className="text-center text-gray-400">
                        {isLogin ? (
                            <>
                                Don’t have an account?
                                <span className="cursor-pointer font-bold text-black" onClick={toggleForm}> Sign up for free</span>
                            </>
                        ) : (
                            <>
                                Already have an account?
                                <span className="cursor-pointer font-bold text-black" onClick={toggleForm}> Sign in</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <img
                        src={image}
                        alt="Visual"
                        className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                    />
                    <div className="absolute hidden top-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
                        <span className="text-white text-xl">
                            We've been using Untitled to kick
                            <br />
                            start every new project and can't
                            <br />
                            imagine working without it.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthComponent;
