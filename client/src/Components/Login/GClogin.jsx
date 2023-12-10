import { NavLink, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
const Cookies = require('js-cookie');

export default function GClogin() {

    const navigate = useNavigate();

    const [user, setuser] = useState({
        gcid: "", password: ""
    })

    const handleInputs = (e) => {
        const { name, value } = e.target; // Destructure name and value directly from event.target

        setuser({ ...user, [name]: value }); // Update state using the name and value of the input field
    };

    const PostData = async (e) => {

        e.preventDefault();

        const { gcid, password } = user;

        const errorMessage = document.getElementById('errorMessage');
        if (!gcid || !password) {
            errorMessage.innerHTML = 'Please fill all the fields';
            return;
        } else {
            errorMessage.innerHTML = '';
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
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("GC Login Successful");
                console.log("GC Login Successful");
                // Set cookie using js-cookie
                Cookies.set('jwtoken', token, { expires: 3 });
                Cookies.set('userId', userId, { expires: 3 });
                Cookies.set('userType', userType, { expires: 3 });

                // navigate('/Dashboard');
                navigate('/');
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
