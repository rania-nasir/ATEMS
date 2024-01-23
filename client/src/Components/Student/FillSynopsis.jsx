import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Fdata } from './SynopsisForm'
import Cookies from 'js-cookie';

const FillSynopsis = () => {
    const userId = Cookies.get('userId');

    const [rollno, setrollno] = useState([]);

    useEffect(() => {
        async function fetchrollno() {
            try {
                const response = await fetch(`http://localhost:5000/std/showStdData/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setrollno(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchrollno();
    }, [userId]);

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
                'Authorization': `${Cookies.get('jwtoken')}`
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
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Fill Synopsis Form
                    </h2>
                </div>

                <div className="mt-6 sm:mx-auto">

                    <form class="sm:mx-auto">
                        <div className='grid grid-cols-3'>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        for="grid-first-name">
                                        Roll Number
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="20F-1234" value={rollno.rollno} />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Name
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Muhammad Ahmad" value={rollno.name} />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        CGPA
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="3.16" value={rollno.cgpa} />

                                </div>
                            </div>

                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Email
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="abc@gmail.com" value={rollno.email}/>


                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Mobile
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="12345678901" value={rollno.mobile}/>

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Semester
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="8" value={rollno.semester}/>

                                </div>
                            </div>

                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Program Name
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Computer Science" value={rollno.program}/>

                                </div>
                            </div>
                            {/* <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Date
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="01-01-2024" />

                                </div>
                            </div> */}
                        </div>

                        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                        <div className='grid grid-cols-2'>
                            <div className='col-span-1 p-2'>

                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Synopsis Title
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        value={user.synopsistitle}
                                        onChange={handleInputs}
                                        required
                                        type="synopsistitle"
                                        name="synopsistitle"
                                        placeholder="Synopsis Title here.." />
                                </div>

                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Select facultyname
                                    </label>
                                    <Dropdown
                                        value={selectedfacultyname}
                                        onChange={(e) => setSelectedfacultyname(e.value)}
                                        options={facultyname}
                                        className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />

                                </div>
                            </div>
                        </div>
                        <div className='p-2'>
                            <div class="w-full px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
                                    Description
                                </label>
                                <textarea class="resize-none h-56 rounded-md appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    value={user.description}
                                    onChange={handleInputs}
                                    required
                                    id="description"
                                    name="description"
                                    type="description"
                                    placeholder="Synopsis Description here..."
                                >
                                </textarea>
                            </div>
                        </div>
                        <div class="m-2 px-3">
                            <button class="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                                onClick={PostData}>
                                Submit Synopsis
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}
export default FillSynopsis;