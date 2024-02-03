import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from "primereact/radiobutton";
import { Fdata } from './SynopsisForm'
import Cookies from 'js-cookie';

const FillSynopsis = () => {
    const userId = Cookies.get('userId');

    const [rollno, setrollno] = useState([]);
    const categories = [
        { name: 'Artificial Intelligence/ Machine Learning/ Data Mining/ Deep Learning/ Data Science', key: 'Artificial Intelligence/ Machine Learning/ Data Mining/ Deep Learning/ Data Science' },
        { name: 'Computer Networks/ Information Security/ Distributed Computing/ Cloud Computing/ IOT', key: 'Computer Networks/ Information Security/ Distributed Computing/ Cloud Computing/ IOT' },
        { name: 'Software Engineering', key: 'Software Engineering' },
        { name: 'Database Manageent System/ Geographical Information Systems', key: 'Database Manageent System/ Geographical Information Systems' },
        { name: 'Computer Vision/ Computer Graphics', key: 'Computer Vision/ Computer Graphics' },
        { name: 'Biosystems/ Computational Biology', key: 'Biosystems/ Computational Biology' }

    ];
    const [selectedCategory, setSelectedCategory] = useState('');

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

    // Here, Fdata contains the list of faculty names
    const facultyname = Fdata.map(name => ({ label: name, value: name }));


    const [user, setUser] = useState({
        synopsistitle: "",
        facultyname: selectedfacultyname,
        potentialareas: selectedCategory
    });
    const handleInputs = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    
    console.log('PA ',selectedCategory)

    const PostData = async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('file_input');
        const proposalFile = fileInput.files[0];

        if (!proposalFile) {
            alert('Please select a file');
            return;
        }

        console.log('PA = ',selectedCategory)

        const synopsisData = new FormData();
        synopsisData.append('synopsistitle', user.synopsistitle);
        synopsisData.append('facultyname', selectedfacultyname); // Use the selected faculty name
        synopsisData.append('potentialareas', selectedCategory);
        synopsisData.append('proposalFile', proposalFile);

        console.log("Synopsis data:", synopsisData);

        const res = await fetch("http://localhost:5000/std/fillSynopsis", {
            method: "POST",
            headers: {
                'Authorization': `${Cookies.get('jwtoken')}`,
                // 'Content-Type': 'multipart/form-data' // Don't set Content-Type manually
            },
            body: synopsisData
        });

        const data = await res.json();
        console.log("Response data:", data);

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
                window.alert("Invalid Credentials", data);
            } else {
                window.alert("Submitted Synopsis Successfully");
                console.log("Submitted Synopsis Successfully");
                window.alert("Submitted Synopsis Successfully", data);
                navigate('/');
            }
        } else {
            window.alert("Something went wrong", data);
            console.log("Something went wrong", data);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="w-full my-4">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Thesis 1 Registration Proposal Form
                    </h2>
                </div>

                <div className="mt-6 sm:mx-auto">
                    <form class="sm:mx-auto" enctype="multipart/form-data">
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
                                        id="grid-first-name" type="text" placeholder="abc@gmail.com" value={rollno.email} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Mobile
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="12345678901" value={rollno.mobile} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Semester
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="8" value={rollno.semester} />
                                </div>
                            </div>
                        </div>

                        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                        <div className='grid grid-cols-2'>
                            <div className='p-2 col-span-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Thesis Title
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        value={user.synopsistitle}
                                        onChange={handleInputs}
                                        required
                                        type="synopsistitle"
                                        name="synopsistitle"
                                        placeholder="Thesis Title Here.." />
                                </div>
                            </div>
                            <div className='p-2 col-span-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Potential Areas
                                    </label>
                                    <div className="card flex justify-content-center py-2">
                                        <div className="appearance-none w-full block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-50">
                                            {categories.map((category) => (
                                                <div key={category.key} className="flex align-items-center my-4">
                                                    <RadioButton
                                                        inputId={category.key}
                                                        name="category"
                                                        value={category.name}
                                                        onChange={(e) => setSelectedCategory(e.value)}
                                                        checked={selectedCategory.key === category.key}
                                                    />
                                                    <label htmlFor={category.key} className="ml-2">{category.name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='p-2 col-span-1'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Select Supervisor
                                    </label>
                                    <Dropdown
                                        value={selectedfacultyname}
                                        onChange={(e) => setSelectedfacultyname(e.value)}
                                        options={facultyname}
                                        className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />

                                </div>
                            </div>

                            <div className='col-span-1 justify-left p-2'>
                                <label className="px-3 block my-1 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
                                    Upload Thesis 1 Registration Propsal
                                </label>
                                <div>
                                    <input
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        aria-describedby="file_input_help"
                                        id="file_input"
                                        type="file"
                                        name='proposalFile'
                                        accept=".pdf" // Change this to accept only PDF files
                                    // onChange={handleFileChange}
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                                        Pdf files only.
                                    </p>

                                </div>
                            </div>
                        </div>
                        <div class="m-2 px-3">
                            <button class="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                                onClick={PostData}>
                                Register
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}
export default FillSynopsis;