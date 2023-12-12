import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import Cookie from 'js-cookie';

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
                    "Content-Type": "application/json",
                    "Authorization": `${Cookie.get('jwtoken')}`
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
                        Make Announcement
                    </h2>
                </div>
                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="w-full max-w-lg">
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Announcement Title
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="announcementTitle"
                                    name="announcementTitle"
                                    announcementType="text"
                                    value={user.announcementTitle}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Announcement Content
                                </label>
                                <input
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="announcementContent"
                                    name="announcementContent"
                                    announcementType="announcementContent"
                                    value={user.announcementContent}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div class="w-full px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Announcement Type
                                </label>
                                <Dropdown value={selectedannouncementType}
                                    onChange={(e) => setSelectedannouncementType(e.value)}
                                    options={announcementType}
                                    maxSelectedLabels={3}
                                    className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                            </div>


                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full px-3">
                                <button class="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="button"
                                    onClick={PostData}>
                                    Make Announcement
                                </button>
                            </div>
                        </div>
                    </form>
                </div >
            </div >
        </>
    );
}