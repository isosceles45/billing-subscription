import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { toast } from 'react-toastify';
import firebase from "../../firebase/firebaseConfig"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FallingLines } from 'react-loader-spinner';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const signin = async () => {
        setLoading(true);
        if ( email === "" || password === "" ) {
            toast.error("All required fields");
            setLoading(false);
            return;
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!emailRegex.test(email)) {
            toast.error("Please provide a valid email");
            setLoading(false);
            return;
        }

        try {
            const response = await signInWithEmailAndPassword(firebase.auth(), email, password);
            localStorage.setItem('user', JSON.stringify(response));
            toast.success('Signed in Successfully');
            
            // Use navigate to redirect after successful login
            navigate('/');
        } catch (error) {
            toast.error('Sign in Failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=' flex justify-center items-center h-screen'>
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Log in to your Account</h1>
                </div>
                <div>
                    <input type="email"
                        name='email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Email'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Password'
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                    onClick={signin}
                        className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                        Login
                    </button>
                </div>
                <div className='flex justify-center'>
                {loading && 
                        <FallingLines
                            color="#ffffff"
                            width='50'
                            ariaLabel='falling-lines-loading'
                        />                   
                        }
                </div>
                <div>
                    <h2 className='text-white'>Don't have an account <Link className=' text-yellow-500 font-bold' to={'/signup'}>Signup</Link></h2>
                </div>
            </div>
        </div>
    )
}

export default Login