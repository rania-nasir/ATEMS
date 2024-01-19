import { useNavigate } from 'react-router-dom';
import React, { useState, NavLink } from 'react';
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
        
            <div className="bg-white m-2">
                <div className="mx-auto flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8"
                >
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                            Make Announcement
                        </h2>
                    </div>

                    <div className="mt-6 sm:mx-auto ">
                        <form className="sm:mx-auto">
                            <div className="grid grid-cols-4">
                                <div className='col-span-1 p-2 flex flex-wrap -mx-3 mb-6'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="announcementType">
                                            Announcement Type
                                        </label>
                                        <Dropdown
                                            value={selectedannouncementType}
                                            onChange={(e) => setSelectedannouncementType(e.value)}
                                            options={announcementType}
                                            maxSelectedLabels={3}
                                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        />
                                    </div>
                                </div>
                                <div className='col-span-3 p-2 flex flex-wrap -mx-3 mb-6'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="announcementTitle">
                                            Announcement Title
                                        </label>
                                        <input
                                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="announcementTitle"
                                            name="announcementTitle"
                                            type="text"
                                            value={user.announcementTitle}
                                            onChange={handleInputs}
                                            placeholder="1234"
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            <div className='p-2 flex flex-wrap -mx-3 mb-6'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="announcementContent">
                                            Announcement Content
                                        </label>
                                        <textarea
                                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            rows={6}
                                            id="announcementContent"
                                            name="announcementContent"
                                            value={user.announcementContent}
                                            onChange={handleInputs}
                                            placeholder="********"
                                        ></textarea>
                                    </div>
                                </div>
                            <div className="ml-2">
                                <button className="block w-64 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    onClick={PostData}
                                >
                                    Make Announcement
                                </button>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
        </>
    );
}