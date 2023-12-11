import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

export default function GetThesisDetails() {

    const navigate = useNavigate();
    const { thesisid } = useParams();
    const [ThesisData, setThesisData] = useState({ selectedThesis: null, facultyList: [] });

    const [selectedInternal1, setselectedInternal1] = useState(null);
    const [selectedInternal2, setselectedInternal2] = useState(null);

    console.log('thesisid ==== ', thesisid);

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch(`http://localhost:5000/gc/ReviewRequest/${thesisid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setThesisData(data);
                    console.log('Thesis Data Detail + Faculty List --> ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, [thesisid]);

    const selectedValue = ThesisData.facultyList ? ThesisData.facultyList.map(item => ({ label: item.name, value: item.name })) : [];

    const approveData = async (e) => {
        e.preventDefault();

        const final_internal1 = selectedInternal1;
        const final_internal2 = selectedInternal2;

        const InternalData = {
            final_internal1,
            final_internal2
        }

        console.log("Internal Data =", InternalData);


        const res = await fetch(`http://localhost:5000/gc/ApproveRequest/${thesisid}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            },
            body: JSON.stringify(InternalData)

        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("Accepted Thesis Successfully");
                console.log("Accepted Thesis Successfully");
                navigate('/');
            }
        } else {
            window.alert("Something went wrong");
            console.log("Something went wrong");
        }
    }

    return (
        <>
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">

                {ThesisData.selectedThesis && (
                    <Card title={"Thesis Request Detail"}>
                        <h3>Thesis ID: {ThesisData.selectedThesis.thesisid}</h3>
                        <h3>Thesis Title: {ThesisData.selectedThesis.thesistitle}</h3>
                        <p>Description: {ThesisData.selectedThesis.description}</p>
                        <p>Roll No: {ThesisData.selectedThesis.rollno}</p>
                        <p>Thesis Status: {ThesisData.selectedThesis.thesisstatus}</p>
                        <h3>Supervisor Faculty ID: {ThesisData.selectedThesis.facultyid}</h3>
                        <h3>Internal 1 Faculty ID: {ThesisData.selectedThesis.internals[0]}</h3>
                        <h3>Internal 2 Faculty ID: {ThesisData.selectedThesis.internals[1]}</h3>
                    </Card>
                )}
            </div>

            <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm flex flex-row gap-3'>
                <form class="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                        {/* <hr class="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" /> */}
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Select Internal 1
                            </label>
                            <Dropdown
                                value={selectedInternal1}
                                options={selectedValue}
                                className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                onChange={(e) => { setselectedInternal1(e.value) }}
                            />
                        </div>
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Select Internal 2
                            </label>
                            <Dropdown
                                value={selectedInternal2}
                                options={selectedValue}
                                className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                onChange={(e) => { setselectedInternal2(e.value) }}
                            />
                        </div>

                    </div>
                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm flex flex-row gap-3">
                        <div className="w-full">
                            <button
                                className="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded mb-2"
                                type="button"
                                name='approvedata'
                                onClick={approveData}
                            >
                                APPROVE THESIS
                            </button>
                        </div>
                    </div>
                </form >
            </div>

        </>
    );
}


