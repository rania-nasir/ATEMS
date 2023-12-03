import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

export default function MakeAnnouncement() {

    const navigate = useNavigate();

    const [selectedannouncementType, setSelectedannouncementType] = useState(null);
    const announcementType = ['Faculty', 'Student', 'Both'];

    const [user, setuser] = useState({
        announcementTitle: "", announcementContent: "", announcementType: selectedannouncementType
    })
    const handleInputs = (e) => {
        const { name, value } = e.target
        setuser({ ...user, [name]: value })
    }

    const PostData = async (e) => {
        e.preventDefault();

        const { announcementTitle, announcementContent } = user;

        const announcementData = {
            announcementTitle, announcementContent, announcementType: selectedannouncementType
        }

        console.log(`announcementType are ===== ` + announcementData.announcementType)

        try {
            const res = await fetch("http://localhost:5000/gc/makeAnnouncement", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(announcementData)

            });


            const data = await res.json();
            console.log("Response data:", data);

            if (res.ok) {
                if (data.message === "Invalid Credentials") {
                    window.alert("Invalid Credentials");
                    console.log("Invalid Credentials");
                } else {
                    window.alert("Announcement Added Successfully");
                    console.log("Announcement Added Successfully");
                    navigate('/GCDashboard');
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
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Make Announcement
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-2" method="POST">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                            <div className="flex flex-col">
                                <label htmlFor="announcementTitle" className="block text-sm font-medium leading-6 text-gray-900">
                                    Announcement Title
                                </label>
                                <input
                                    id="announcementTitle"
                                    name="announcementTitle"
                                    announcementType="text"
                                    autoComplete="off"
                                    value={user.announcementTitle}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="announcementContent" className="block text-sm font-medium leading-6 text-gray-900">
                                    Announcement Content
                                </label>
                                <input
                                    id="announcementContent"
                                    name="announcementContent"
                                    announcementType="announcementContent"
                                    autoComplete="off"
                                    value={user.announcementContent}
                                    onChange={handleInputs}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="flex flex-col">
                                <Dropdown value={selectedannouncementType} onChange={(e) => setSelectedannouncementType(e.value)} options={announcementType}
                                    placeholder="Select Announcement Type" maxSelectedLabels={3} className="leading-6 text-gray-900 font-medium text-sm w-full md:w-20rem" />
                            </div>
                        </div>
                        <div>
                            <button
                                announcementType="button"
                                className="flex mt-6 w-full justify-center rounded-md bg-green-700 hover:bg-green-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                onClick={PostData}
                            >
                                Make Announcement
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}