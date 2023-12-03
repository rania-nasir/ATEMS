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

        const errorMessage = document.getElementById('errorMessage');
        if (!facultyid || !password) {
            errorMessage.innerHTML = 'Please fill all the fields';
            return;
        } else {
            errorMessage.innerHTML = '';
        }


        const res = await fetch("http://localhost:5000/faculty/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                facultyid, password
            })
        }); const data = await res.json();
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
                    <h2 className="text-2xl tracking-tight text-gray-700 font-bold mt-4 mb-2">
                        Sign In to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                                    placeholder="******************" />
                            </div>
                            <p id='errorMessage' class="pl-4 text-red-500 text-xs italic"></p>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                                <button class="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="button"
                                    onClick={PostData}>
                                    Log In
                                </button>
                            </div>
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
