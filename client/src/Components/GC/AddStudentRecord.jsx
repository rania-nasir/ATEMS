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
                    navigate('/');
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
                    <h2 className="text-2xl tracking-tight text-gray-700 font-bold mt-4 mb-2">
                        Add Student Record
                    </h2>
                </div>
                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="w-full max-w-lg">
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Roll Number
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="rollno"
                                    name="rollno"
                                    type="text"
                                    placeholder='20F-1234'
                                    value={user.rollno}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Student Name
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={user.name}
                                    onChange={handleInputs}
                                    placeholder="Muhammad Ali"
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Email
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    value={user.email}
                                    onChange={handleInputs}
                                    placeholder="abc@example.com"

                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Gender
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="gender"
                                    type="text"
                                    placeholder="M/F"
                                    name='gender'
                                    value={user.gender}
                                    onChange={handleInputs} />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Batch
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="batch"
                                    name="batch"
                                    type="text"
                                    value={user.batch}
                                    onChange={handleInputs}
                                    placeholder="20"
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Semester
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="semester"
                                    name="semester"
                                    type="text"
                                    value={user.semester}
                                    onChange={handleInputs}
                                    placeholder="7"
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Program Name
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="program"
                                    name="program"
                                    type="text"
                                    value={user.program}
                                    onChange={handleInputs}
                                    placeholder="CS/SE"
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    CGPA
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="cgpa"
                                    name="cgpa"
                                    type="text"
                                    value={user.cgpa}
                                    onChange={handleInputs}
                                    placeholder="3.5"
                                />
                            </div>
                            <div class="w-full px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Mobile
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="mobile"
                                    name="mobile"
                                    type="text"
                                    autoComplete="off"
                                    value={user.mobile}
                                    onChange={handleInputs}
                                    placeholder="12345678910"
                                />
                            </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                                <button class="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="button"
                                    onClick={PostData}>
                                    Add Student
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* <p className="mt-10 text-center text-sm text-gray-500">
                        For description related queries contact concerned Academic Officer on  {' '}
                        <NavLink to="#" className="font-semibold leading-6 text-green-600 hover:text-green-500">
                            nu.edu.pk
                        </NavLink>
                    </p> */}
                </div >
            </div >
        </>
    );
}
