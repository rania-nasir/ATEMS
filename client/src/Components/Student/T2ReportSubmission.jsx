// Import necessary dependencies
import React, { useRef, useState } from 'react';
import Cookies from 'js-cookie';

// Define the T2ReportSubmission component
function T2ReportSubmission() {
    const  fileUploadRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    // Function to handle the upload click event
    const handleUploadClick = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        // Create a FormData object to append the selected file
        const formData = new FormData();
        formData.append('thesisTwoReportFile', selectedFile); // Updated field name

        try {
            // Send a PUT request to the backend endpoint
            const response = await fetch('http://localhost:5000/std/uploadThesisTwoReport', {
                method: 'PUT',
                headers: {
                    'Authorization': `${Cookies.get('jwtoken')}`,
                },
                body: formData,
            });

            // Handle the response from the server
            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }

        } catch (error) {
            console.error('Error uploading the report:', error);
            alert('Error uploading the report');
        }
    };

    // Function to handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(file.name); // Update filename
    };

    // Render the component JSX
    return (
        <>
            <div className='flex flex-col justify-center px-10 my-10 items-center'>
                <div className="w-full my-8">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        MS Thesis/ Project 2 Report Submission
                    </h2>
                </div>
                <div className="flex justify-center items-center w-[60%]">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-18 py-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop. PDF files only (MAX. 800x400px).</p>
                            {fileName && <p className="text-xs text-gray-500 dark:text-gray-400">Selected file: {fileName}</p>} {/* Display filename */}
                        </div>
                        <input id="dropzone-file"
                            ref={fileUploadRef}
                            type="file"
                            accept="application/pdf, application/octet-stream, application/x-pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                </div>
                <button
                    className="block mx-4 my-8 w-[20%] h-12 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
                    onClick={handleUploadClick}
                >
                    Upload Report
                </button>
            </div>
        </>
    )
}

// Export the component
export default T2ReportSubmission;
