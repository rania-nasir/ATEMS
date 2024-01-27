import React from 'react';
import Cookies from 'js-cookie';

const AddStudent = () => {
    // const handleFileChange = (e) => {
    //     // Handle file change logic here
    // };

    const PostData = async (e) => {

        try {
            const fileInput = document.getElementById('file_input');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a file');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:5000/gc/uploadStdData', {
                method: 'POST',
                headers: {
                    'Authorization': `${Cookies.get('jwtoken')}`,
                },
                body: formData,
            });

            console.log('response status:', response.status);
            const responseBody = await response.text();
            console.log('response body:', responseBody);

            if (response.ok) {
                const result = JSON.parse(responseBody);
                alert(result.message);
            } else {
                const error = JSON.parse(responseBody);
                alert(`Error: ${error.message}`);
            }

        } catch (error) {
            console.error('Error adding Student record:', error);
            alert('Error adding Student record');
        }
    }

    return (
        <div className='flex justify-end my-10'>
            <label className="block mx-4 pt-1 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
                Upload Excel File To Add Student Members
            </label>
            <div>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept=".xls, .xlsx"
                // onChange={handleFileChange}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                    Excel files only (MAX. 800x400px).
                </p>

            </div>
            <button
                className="block mx-4 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
                onClick={PostData}
            >
                Add Student Record
            </button>
        </div>
    );
};

export default AddStudent;
