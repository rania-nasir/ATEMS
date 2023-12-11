// MSRCThesisDetails.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Card } from 'primereact/card';

export default function MSRCThesisDetails() {

    const navigate = useNavigate();

    const { thesisid } = useParams();
    const [ThesisData, setThesisData] = useState({ selectedThesis: null });
    const [comment, setcomment] = useState('');


    console.log('thesisid ==== ', thesisid);

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/msrcThesisDetails/${thesisid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setThesisData(data);
                    console.log('Thesis Data Detail --> ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, [thesisid]);

    const handleInputs = (e) => {
       setcomment(e.target.value);
    };

    const PostFeedbackData = async (e) => {
        e.preventDefault();

        console.log('Feedback: ', comment);

        const res = await fetch(`http://localhost:5000/faculty/msrcSubmitFeedback/${thesisid}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            },
            body: JSON.stringify({comment})

        });

        const data = await res.json();
        console.log("Response data:- ", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("Feedback Submitted Successfully");
                console.log("Feedback Submitted Successfully");
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
                        <div class="w-full px-3">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
                                Description
                            </label>
                            <textarea class="resize-none h-96 rounded-md appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                value={comment}
                                onChange={handleInputs}
                                required
                                id="comment"
                                name="comment"
                                type="comment"
                                placeholder="Feedback Content here..."
                            >
                            </textarea>
                        </div>
                        <p id='errorMessage' class="pl-4 text-red-500 text-xs italic"></p>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3">
                            <button class="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
                                type="button"
                                onClick={PostFeedbackData}>
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </form >
            </div>

        </>
    );
}


