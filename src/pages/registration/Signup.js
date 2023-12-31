import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import firebase from "../../firebase/firebaseConfig"
import { FallingLines } from 'react-loader-spinner';

function Signup() {

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const signup = async () => {
        setLoading(true);
        if (name === "" || email === "" || password === "" ) {
            return toast.error("All required fields")
        }
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!emailRegex.test(email)) {
            return toast.error("Please provide a valid")
        }

        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);

            if (response.user) {
                await response.user.updateProfile({ displayName: name });

                const uid = response.user.uid;
                const useRef = firebase.database().ref('users/' + uid);
                await useRef.set({
                    uid: uid,
                    email: email,
                    userName: name
                });
            }

            setName("");
            setEmail("");
            setPassword("");
            toast.success('Signup Success');
            navigate("/login");
        } catch (error) {
            toast.error('Signup Failed');
            console.log(error.message);
        } finally {
            setLoading(false); // Reset loading state in both success and error cases
        }    
        
    }
   
    return (
        <div className=' flex justify-center items-center h-screen'>
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Create Account</h1>
                </div>
                <div>
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name='name'
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Name'
                    />
                </div>
                <div>
                    <input type="email"
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Email'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Password'
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                        className=' bg-red-500 w-full text-white font-bold  px-2 py-2 rounded-lg'
                        onClick={signup}
                        >
                        Signup
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
                    <h2 className='text-white'>Have an account <Link className=' text-red-500 font-bold' to={'/login'}>Login</Link></h2>
                </div>
            </div>
        </div>
    )
}

export default Signup