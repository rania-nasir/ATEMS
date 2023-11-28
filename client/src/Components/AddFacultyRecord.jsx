import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function AddFacultyRecord() {

    const navigate = useNavigate();

    const [user, setuser] = useState({
        facultyid: "", name: "", email: "",
        gender: "", mobile: "", password: ""  
    })
    const handleInputs = (e) => {
        const { name, value } = e.target
        setuser({ ...user, [name]: value })
    }

    const PostData = async (e) => {
        e.preventDefault();

        const { facultyid, name, email, gender, mobile, password } = user;

        try {
            const res = await fetch("http://localhost:5000/gc/addFaculty", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    facultyid, name, email, gender, mobile, password
                })
            });

            const data = await res.json();
            console.log("Response data:", data);

            if (res.ok) {
                if (data.message === "Invalid Credentials") {
                    window.alert("Invalid Credentials");
                    console.log("Invalid Credentials");
                } else {
                    window.alert("Faculty Added Successfully");
                    console.log("Faculty Added Successfully");
                    navigate('/GCDashboard');
                }
            } else {
                window.alert("Something went wrong");
                console.log("Something went wrong");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            window.alert("Error occurred. Please try again.");
        }
    };


    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Add Faculty Record
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-2" method="POST">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                            <div className="flex flex-col">
                                <label htmlFor="facultyid" className="block text-sm font-medium leading-6 text-gray-900">
                                    Faculty ID
                                </label>
                                <input
                                    id="facultyid"
                                    name="facultyid"
                                    type="text"
                                    autoComplete="off"
                                    value={user.facultyid}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Faculty Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={user.name}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    value={user.email}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                    Gender
                                </label>
                                <input
                                    id="gender"
                                    name="gender"
                                    type="text"
                                    autoComplete="off"
                                    value={user.gender}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="mobile" className="block text-sm font-medium leading-6 text-gray-900">
                                    Mobile
                                </label>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="text"
                                    autoComplete="off"
                                    value={user.mobile}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    value={user.password}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="flex mt-6 w-full justify-center rounded-md bg-green-700 hover:bg-green-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                onClick={PostData}
                            >
                                Add Faculty
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
