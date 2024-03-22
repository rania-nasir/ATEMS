import React, { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import signincover from '../../Images/admincover.jpg';
import Cookies from 'js-cookie';

export default function GClogin() {
    const toastTopCenter = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState({
        gcid: "",
        password: ""
    });
    const [isInvalidFacultyId, setIsInvalidFacultyId] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

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
        return !!password;
    };

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, detail: label, life: 3000 });
    };

    const PostData = async (e) => {
        e.preventDefault();

        const { gcid, password } = user;

        if (!validateFacultyId(gcid) || !passwordExists(password)) {
            showMessage('error', 'Please fill all the entries correctly!');
            return;
        }

        const res = await fetch("http://localhost:5000/gc/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gcid,
                password
            })
        });
        const data = await res.json();

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                showMessage('error', 'Invalid Credentials');
            } else {
                showMessage('success', 'Graduate Coordinator Login Successful');
                Cookies.set('jwtoken', data.token, { expires: 3 });
                Cookies.set('userId', data.userId, { expires: 3 });
                Cookies.set('userType', data.userType, { expires: 3 });
                console.log("GC Login Successful");
                navigate('/Dashboard');
                window.location.reload();
            }
        } else {
            showMessage('error', 'Invalid Credentials!');
            console.log("Something went wrong");
        }
    };

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
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
                            <form className="w-full max-w-lg">
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-800 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                            GC ID (Graduate Coordinator): {isInvalidFacultyId && (
                                                <span className="lowercase text-red-500 text-xs italic m-2"> Invalid Faculty ID format</span>
                                            )}
                                        </label>
                                        <input className={`appearance-none block w-full ${isInvalidFacultyId ? 'border-red-500' : 'bg-gray-200'} bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                                            value={user.gcid}
                                            onChange={handleInputs}
                                            required
                                            type="gcid"
                                            name="gcid"
                                            placeholder="1234" />

                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-800 text-xs font-bold mb-2" htmlFor="grid-password">
                                            Password {isPassword && (
                                                <span className="lowercase text-red-500 text-xs italic m-2"> Please Enter Password</span>
                                            )}
                                        </label>
                                        <input className={`appearance-none block w-full ${isPassword ? 'border-red-500' : 'bg-gray-200'} bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                                            value={user.password}
                                            onChange={handleInputs}
                                            required
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="********" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <button className="block w-full flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                            type="button"
                                            onClick={PostData}
                                            label="Top Center">
                                            Log In
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <p className="mt-6 text-center text-sm text-gray-">
                                For password-related queries, contact the concerned Academic Officer at {' '}
                                <NavLink to="mailto:projectatems@gmail.com" className="font-bold leading-6 text-teal-300 hover:text-gray-900">
                                    projectatems
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
