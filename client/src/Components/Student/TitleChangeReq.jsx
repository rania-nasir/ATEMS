import { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';

export default function TitleChangeReq() {
    const toastTopCenter = useRef(null);

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    const [user, setUser] = useState({
        thesistitle: ''
    });

    const [titlechangeData, setTitleChangeData] = useState(false);

    useEffect(() => {
        async function fetchTitleChangeData() {
            try {
                const response = await fetch('http://localhost:5000/std/viewTitleChangeForm', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.message === 'Thesis found') {
                        setTitleChangeData(true);
                    }
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchTitleChangeData();
    }, []);

    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/std/requestTitleChange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                },
                body: JSON.stringify({ newThesisTitle: user.thesistitle })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                // window.alert(data.message);
                if (data.message === "Request for Title change successfully submitted") {
                    showMessage('success', data.message);
                }
                else {
                    showMessage('info', data.message)
                }
                // Handle successful submission, e.g., show a success message
            } else {
                showMessage('error', "System Error! Please try later.")
                throw new Error('Failed to submit title change request');
            }
        } catch (error) {
            console.error('Error submitting title change request:', error);
            // Handle error, e.g., show an error message to the user
        }
    };

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className='flex flex-col justify-center px-10 my-10 items-center'>
                <div className="w-full my-8">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        MS Thesis Title Change Request
                    </h2>
                </div>
                <div className="flex justify-center items-center w-[70%]">
                    <form className="w-full" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className='w-full px-3'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Thesis Title
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                value={user.thesistitle}
                                onChange={handleInputs}
                                required
                                type="text"
                                name="thesistitle"
                                placeholder="Your Thesis Title Here.." />
                        </div>
                        <button
                            className="block mx-4 my-8 w-[25%] h-12 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
                            type="submit"
                        >
                            Change Thesis Title
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
