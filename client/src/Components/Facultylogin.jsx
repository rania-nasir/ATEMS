import Atemlogo from '../Images/faviconn.png'
import { NavLink, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

export default function Facultylogin() {

    const navigate = useNavigate();

    const [user, setuser] = useState({
        facultyid: "", password: ""
    })

    const handleInputs = (e) => {
        const { name, value } = e.target; // Destructure name and value directly from event.target

        setuser({ ...user, [name]: value }); // Update state using the name and value of the input field
    };

    const PostData = async (e) => {
    
        e.preventDefault();

        const { facultyid, password } = user;

        const res = await fetch("http://localhost:5000/faculty/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                facultyid, password
            })
        });const data = await res.json();
        console.log("Response data:", data); // Log the response data
    
        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("Login Successful");
                console.log("Login Successful");
                navigate('/facultyhome');
            }
        } else {
            window.alert("Something went wrong");
            console.log("Something went wrong");
        }
    }
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-20 w-auto"
                        src={Atemlogo}
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign In to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" method="POST">
                        <div>
                            <label htmlFor="facultyid" className="block text-sm font-medium leading-6 text-gray-900">
                                Faculty ID
                            </label>
                            <div className="mt-2">
                                <input
                                    id="facultyid"
                                    name="facultyid"
                                    type="facultyid"
                                    autoComplete="off"
                                    value={user.facultyid}
                                    onChange={handleInputs}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <NavLink to="#" className="font-semibold text-green-600 hover:text-green-500">
                                        Forgot password?
                                    </NavLink>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    value={user.password}
                                    onChange={handleInputs}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                className="flex w-full justify-center rounded-md bg-green-700 hover:bg-green-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                onClick={PostData}
                            >
                                Log In
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        For Password related queries contact concerned Academic Officer on  {' '}
                        <NavLink to="#" className="font-semibold leading-6 text-green-600 hover:text-green-500">
                            nu.edu.pk
                        </NavLink>
                    </p>
                </div>
            </div>
        </>
    )
}
