import { NavLink, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

import signincover from '../../Images/logincover.png'

const Cookies = require('js-cookie');

export default function GClogin() {

    // const isLoggedIn = authToken && userDetails.userType;

    const navigate = useNavigate();

    const [user, setuser] = useState({
        gcid: "", password: ""
    })

    const [isInvalidFacultyId, setIsInvalidFacultyId] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setuser({ ...user, [name]: value });

        // Validate faculty ID only when gcid input changes
        if (name === 'gcid') {
            const isValidFacultyId = validateFacultyId(value);
            setIsInvalidFacultyId(!isValidFacultyId);
        }

        if (name === 'password') {
            setIsPassword(!passwordExists(value));
        }
    };

    const validateFacultyId = (facultyId) => {
        const facultyIdRegex = /^\d{4}$/;
        return facultyIdRegex.test(facultyId);
    };
    const passwordExists = (password) => {
        if (!password) {
            return false;
        }
        else {
            return true;
        }
    };

    const PostData = async (e) => {

        e.preventDefault();

        const { gcid, password } = user;

        if (!validateFacultyId(gcid)) {
            setIsInvalidFacultyId(true);
            return;
        } else {
            setIsInvalidFacultyId(false);
        }

        if (!passwordExists(password)) {
            setIsPassword(true);
            return;
        } else {
            setIsPassword(false);
        }

        const res = await fetch("http://localhost:5000/gc/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gcid, password
            })
        }); const data = await res.json();
        console.log("Response data:", data); // Log the response data
        console.log("data = ", data)

        const { token, userId, userType } = data;

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                document.getElementById('msg').innerHTML = 'Invalid Credentials';
                // window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                // Set cookie using js-cookie
                Cookies.set('jwtoken', token, { expires: 3 });
                Cookies.set('userId', userId, { expires: 3 });
                Cookies.set('userType', userType, { expires: 3 });
                navigate('/');
            }
            // window.alert("GC Login Successful");
            console.log("GC Login Successful");
            window.location.reload(); // Refresh the page      
        } else {
            document.getElementById('msg').innerHTML = 'Invalid Credentials';
            // window.alert("Something went wrong");
            console.log("Something went wrong");
        }
    }
    return (
        <>
            <div className='grid grid-cols-6 p-5'>

                <div className='col-span-2 flex justify-center items-center ml-12'>
                    <img className='w-80' src={signincover} alt="cover" />
                </div>

                <div className="col-span-4 mx-auto shadow-xl bg-white" >
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="text-2xl tracking-tight text-gray-950 font-bold">
                                Sign In to your account
                            </h2>
                        </div>

                        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">

                            <span id='msg' className="justify-center flex text-red-500 font-bold italic text-xs italic mt-2"></span>

                            <form class="w-full max-w-lg">

                                <div class="flex flex-wrap -mx-3 mb-6">
                                    <div class="w-full px-3 mb-6 md:mb-0">
                                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                            GC ID {isInvalidFacultyId && (
                                                <span className="text-red-500 text-xs italic mt-2"> Invalid Faculty ID format</span>
                                            )}
                                        </label>
                                        <input class={`appearance-none block w-full ${isInvalidFacultyId ? 'border-red-500' : 'bg-gray-200'} bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                                            value={user.gcid}
                                            onChange={handleInputs}
                                            required
                                            type="gcid"
                                            name="gcid"
                                            placeholder="1234" />

                                    </div>
                                </div>
                                <div class="flex flex-wrap -mx-3 mb-6">
                                    <div class="w-full px-3">
                                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                            Password {isPassword && (
                                                <span className="text-red-500 text-xs italic mt-2"> Please Enter Password</span>
                                            )}
                                        </label>
                                        <input class={`appearance-none block w-full ${isPassword ? 'border-red-500' : 'bg-gray-200'} bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                                            value={user.password}
                                            onChange={handleInputs}
                                            required
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="********" />
                                    </div>
                                    {/* <p id='errorMessage' class="pl-4 text-red-500 text-xs italic"></p> */}
                                </div>
                                <div class="flex flex-wrap -mx-3 mb-6">
                                    <div class="w-full px-3">
                                        <button class="block w-full flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                            type="button"
                                            onClick={PostData}>
                                            Log In
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <p className="mt-5 text-center text-sm text-gray-">
                                For Password related queries contact concerned Academic Officer on  {' '}
                                <NavLink to="#" className="font-bold leading-6 text-teal-300 hover:text-gray-900">
                                    nu.edu.pk
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 
                <div className="col-span-3 mx-auto shadow-xl bg-white" style={{ border: '1px solid red' }}>
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
                    style={{ border: '1px solid red' }}>
                        <div className='sm:mx-auto sm:w-full sm:max-w-sm' style={{ border: '1px solid red' }}>
                            <h2 className="text-2xl tracking-tight text-gray-700 font-bold mt-4 mb-2">
                                Sign In to your account
                            </h2>
                        </div>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form class="w-full max-w-lg">
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full px-3 mb-6 md:mb-0">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        GC ID
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        value={user.gcid}
                                        onChange={handleInputs}
                                        required
                                        type="gcid"
                                        name="gcid"
                                        placeholder="1234" />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full px-3">
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                        Password
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        value={user.password}
                                        onChange={handleInputs}
                                        required
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="********" />
                                </div>
                                <p id='errorMessage' class="pl-4 text-red-500 text-xs italic"></p>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full px-3">
                                    <button class="block w-full flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                        type="button"
                                        onClick={PostData}>
                                        Log In
                                    </button>
                                </div>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            For Password related queries contact concerned Academic Officer on  {' '}
                            <NavLink to="#" className="font-semibold leading-6 text-teal-300 hover:text-teal-600">
                                nu.edu.pk
                            </NavLink>
                        </p>
                    </div>
                </div> */}
            </div>

        </>
    )
}
