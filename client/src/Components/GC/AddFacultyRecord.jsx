import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import Cookie from 'js-cookie';

export default function AddFacultyRecord() {

    const navigate = useNavigate();

    const [selectedrole, setSelectedrole] = useState(null);
    const role = ['Supervisor', 'MSRC', 'Internal'];

    const [user, setuser] = useState({
        facultyid: "", name: "", email: "",
        gender: "", mobile: "", role: selectedrole, password: ""
    })
    const handleInputs = (e) => {
        const { name, value } = e.target
        setuser({ ...user, [name]: value })
    }

    const PostData = async (e) => {
        e.preventDefault();

        const { facultyid, name, email, gender, mobile, password } = user;

        const facultyData = {
            facultyid, name, email, gender, mobile, role: selectedrole, password
        }

        console.log(`role are ===== ` + facultyData.role)

        try {
            const res = await fetch("http://localhost:5000/gc/addFaculty", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${Cookie.get('jwtoken')}`
                },
                body: JSON.stringify(facultyData)
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
                        Add Faculty Record
                    </h2>
                </div>
                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="w-full max-w-lg">
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Faculty ID
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="facultyid"
                                    type="text"
                                    placeholder="1234"
                                    name="facultyid"
                                    value={user.facultyid}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Faculty Name
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="name"
                                    type="text"
                                    placeholder="Muhammad Fayyaz"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Email
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="email"
                                    type="text"
                                    placeholder="abc@example.com"
                                    name='email'
                                    value={user.email}
                                    onChange={handleInputs}
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
                                    Mobile
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="mobile"
                                    type="text"
                                    placeholder="12345678910"
                                    name='mobile'
                                    value={user.mobile}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Roles
                                </label>
                                <MultiSelect value={selectedrole} onChange={(e) => setSelectedrole(e.value)} options={role}
                                    maxSelectedLabels={3}
                                    className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                            </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                                <button class="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="button"
                                    onClick={PostData}>
                                    Add Faculty
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