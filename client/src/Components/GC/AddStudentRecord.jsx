import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Cookie from 'js-cookie';

export default function AddStudentRecord() {

    const navigate = useNavigate();

    const [user, setuser] = useState({
        rollno: "", name: "", email: "",
        gender: "", batch: "", semester: "",
        program: "", cgpa: "", mobile: ""
    })
    const handleInputs = (e) => {
        const { name, value } = e.target
        setuser({ ...user, [name]: value })
    }

    const PostData = async (e) => {
        e.preventDefault();

        const { rollno, name, email, gender, batch, semester, program, cgpa, mobile } = user;

        try {
            const res = await fetch("http://localhost:5000/gc/addstudent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${Cookie.get('jwtoken')}`
                },
                body: JSON.stringify({
                    rollno, name, email, gender, batch, semester, program, cgpa, mobile
                })
            });

            const data = await res.json();
            console.log("Response data:", data);

            if (res.ok) {
                if (data.message === "Invalid Credentials") {
                    window.alert("Invalid Credentials");
                    console.log("Invalid Credentials");
                } else {
                    window.alert("Student Added Successfully");
                    console.log("Student Added Successfully");
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
                        Add Student Record
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-2" method="POST">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                            <div className="flex flex-col">
                                <label htmlFor="rollno" className="block text-sm font-medium leading-6 text-gray-900">
                                    Roll Number
                                </label>
                                <input
                                    id="rollno"
                                    name="rollno"
                                    type="text"
                                    autoComplete="off"
                                    value={user.rollno}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Student Name
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
                                <label htmlFor="batch" className="block text-sm font-medium leading-6 text-gray-900">
                                    Batch
                                </label>
                                <input
                                    id="batch"
                                    name="batch"
                                    type="text"
                                    autoComplete="off"
                                    value={user.batch}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="semester" className="block text-sm font-medium leading-6 text-gray-900">
                                    Semester
                                </label>
                                <input
                                    id="semester"
                                    name="semester"
                                    type="text"
                                    autoComplete="off"
                                    value={user.semester}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="program" className="block text-sm font-medium leading-6 text-gray-900">
                                    Program Name
                                </label>
                                <input
                                    id="program"
                                    name="program"
                                    type="text"
                                    autoComplete="off"
                                    value={user.program}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="cgpa" className="block text-sm font-medium leading-6 text-gray-900">
                                    CGPA
                                </label>
                                <input
                                    id="cgpa"
                                    name="cgpa"
                                    type="text"
                                    autoComplete="off"
                                    value={user.cgpa}
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
                        </div>
                        <div>
                            <button
                                type="button"
                                className="flex mt-6 w-full justify-center rounded-md bg-green-700 hover:bg-green-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                onClick={PostData}
                            >
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
