import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Fdata } from './SynopsisForm'
import Cookie from 'js-cookie';

const FillSynopsis = () => {

    const navigate = useNavigate();

    console.log('Fdata-:', Fdata);

    const [selectedfacultyname, setSelectedfacultyname] = useState(null);
    // const facultyname = ['facultyname 1', 'facultyname 2', 'facultyname 3'];

    // Here, Fdata contains the list of faculty names
    const facultyname = Fdata.map(name => ({ label: name, value: name }));


    const [user, setUser] = useState({
        synopsistitle: "",
        description: "",
        facultyname: selectedfacultyname
    });
    const handleInputs = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const PostData = async (e) => {
        e.preventDefault();

        const { synopsistitle, description } = user;

        const synopsisData = {
            synopsistitle, description, facultyname: selectedfacultyname
        }

        console.log(`Synopsis-faculties` + synopsisData.facultyname)


        const res = await fetch("http://localhost:5000/std/fillSynopsis", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            },
            body: JSON.stringify(synopsisData)

        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("Submitted Synopsis Successfully");
                console.log("Submitted Synopsis Successfully");
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
                        Fill Synopsis Form
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="w-full max-w-lg">
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Roll Number
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Name
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    CGPA
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Email
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Mobile
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Semester
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Program Name
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Date
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            </div>
                            <hr class="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
                            <div className="w-full px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Select facultyname
                                </label>
                                <Dropdown
                                    value={selectedfacultyname}
                                    onChange={(e) => setSelectedfacultyname(e.value)}
                                    options={facultyname}
                                    className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                            </div>
                            <div class="w-full px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Synopsis Title
                                </label>
                                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    value={user.synopsistitle}
                                    onChange={handleInputs}
                                    required
                                    type="synopsistitle"
                                    name="synopsistitle"
                                    placeholder="Title here.." />
                            </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
                                    Description
                                </label>
                                <textarea class="resize-none h-96 rounded-md appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    value={user.description}
                                    onChange={handleInputs}
                                    required
                                    id="description"
                                    name="description"
                                    type="description"
                                    placeholder="description here..."
                                >
                                </textarea>
                            </div>
                            <p id='errorMessage' class="pl-4 text-red-500 text-xs italic"></p>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                                <button class="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="button"
                                    onClick={PostData}>
                                    Submit Synopsis
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
    )
}
export default FillSynopsis;