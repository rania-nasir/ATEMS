import React, { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import signincover from '../../Images/logincover.png'

const Cookies = require('js-cookie');

const LoginPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        facultyid: "",
        rollno: "",
        password: "",
        userType: "student" // default to student login
    });

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleUserTypeChange = (type) => {
        setUser({ ...user, userType: type });
    };

    const PostData = async (e) => {
        e.preventDefault();
        const { facultyid, rollno, password, userType } = user;

        // const errorMessage = document.getElementById('errorMessage');
        // if (!rollno || !password) {
        //     errorMessage.innerHTML = 'Please fill all the fields';
        //     return;
        // } else {
        //     errorMessage.innerHTML = '';
        // }

        var res;

        if (userType === 'student') {
            res = await fetch(`http://localhost:5000/std/signIn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rollno, password })
            });
        }
        else if (userType === 'faculty') {
            res = await fetch(`http://localhost:5000/faculty/signIn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ facultyid, password })
            });
        }

        const data = await res.json();
        console.log("Response data:", data);

        const { token, userId } = data;

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                Cookies.set('jwtoken', token, { expires: 3 });
                Cookies.set('userId', userId, { expires: 3 });
                Cookies.set('userType', userType, { expires: 3 });
                window.alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} Login Successful`);
                navigate('/');
                window.location.reload();
            }
        } else {
            window.alert("Something went wrong");
            console.log("Something went wrong");
        }
    };
    return (
        <>
            <div className="grid grid-cols-6 p-4">

                {/* Who page */}

                <div className="col-span-2">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center mt-10">

                        <h3 class="mt-10 mb-5 text-xl font-bold text-gray-900 dark:text-white">Who Is There?</h3>
                        <ul class="mt-10 grid w-full gap-6 md:grid-cols-2">
                            <li>
                                <input
                                    type="radio"
                                    id="hosting-small-faculty"
                                    name="hosting"
                                    value="hosting-small"
                                    class="hidden peer"
                                    checked={user.userType === 'faculty'}
                                    onChange={() => handleUserTypeChange('faculty')}
                                    required />
                                <label for="hosting-small-faculty" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-cyan-600 peer-checked:border-cyan-700 peer-checked:text-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">Faculty</div>
                                    </div>
                                    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </label>
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    id="hosting-big-student"
                                    name="hosting"
                                    value="hosting-big"
                                    class="hidden peer"
                                    checked={user.userType === 'student'}
                                    onChange={() => handleUserTypeChange('student')} />
                                <label for="hosting-big-student" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-cyan-600 peer-checked:border-cyan-700 peer-checked:text-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">Student</div>
                                    </div>
                                    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </label>
                            </li>
                        </ul>

                    </div>
                </div>

                {/* Login form */}

                <div className="col-span-2 mx-auto shadow-xl bg-white" >
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="text-2xl tracking-tight text-gray-950 font-bold">
                                Sign In to your account
                            </h2>
                        </div>

                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                            {/* Student and Faculty Login Forms */}
                            {user.userType === 'student' ? (
                                // Student login form
                                <form class="w-full max-w-lg">
                                    <div class="flex flex-wrap -mx-3 mb-6">
                                        <div class="w-full px-3 mb-6 md:mb-0">
                                            <label class="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2" for="grid-first-name">
                                                Roll Number
                                            </label>
                                            <input class="appearance-none block w-full bg-gray-100 text-gray-800 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                value={user.rollno}
                                                onChange={handleInputs}
                                                required
                                                type="rollno"
                                                name="rollno"
                                                placeholder="20F-1234" />
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap -mx-3 mb-6">
                                        <div class="w-full px-3">
                                            <label class="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2" for="grid-password">
                                                Password
                                            </label>
                                            <input class="appearance-none block w-full bg-gray-100 text-gray-800 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                            ) : (
                                // Faculty login form
                                <form class="w-full max-w-lg">
                                    <div class="flex flex-wrap -mx-3 mb-6">
                                        <div class="w-full px-3 mb-6 md:mb-0">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                                Faculty ID
                                            </label>
                                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                value={user.facultyid}
                                                onChange={handleInputs}
                                                required
                                                type="facultyid"
                                                name="facultyid"
                                                placeholder="F-1234" />
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
                            )}


                            <p className="mt-6 text-center text-sm text-gray-">
                                For Password related queries contact concerned Academic Officer on  {' '}
                                <NavLink to="#" className="font-bold leading-6 text-teal-300 hover:text-gray-900">
                                    nu.edu.pk
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cover Image  */}

                <div className="col-span-2 flex justify-center items-center m-6 p-10">
                    <img src={signincover} alt="loginimg" />
                </div>
            </div>

        </>
    )
}

export default LoginPage;