import React from "react";
import { NavLink } from "react-router-dom";

import cardImg from '../../Images/cardImg.jpg';

const Aboutsection = () => {
    return (
        <>
            <div className='grid grid-cols-1 gap-0 px-12 py-8'>
                <div className='my-7'>
                    <h2 class="pb-7 text-4xl tracking-tight font-extrabold text-center text-gray-800 dark:text-white">About Us</h2>
                    <p class="font-light text-center text-gray-600 dark:text-gray-400 sm:text-xl">We're Building Future</p>
                </div>

                <div className='col-span-2 grid grid-cols-1 m-4 gap-4'>

                    {/* Second row with two columns */}
                    <div className="grid grid-cols-3">
                        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <NavLink to="#">
                                <img class="rounded-t-lg" src={cardImg} alt="" />
                            </NavLink>
                            <div class="p-5">
                                <NavLink to="#">
                                    <h5 class="mb-2 mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome to ATEMS - the Academic Thesis Evaluation and Management System</h5>
                                </NavLink>
                                <p class="mb-3 mt-5 font-normal text-gray-700 dark:text-gray-400"> Revolutionizing thesis management. Streamlined, error-free, and user-friendly. Modernize your thesis experience today!</p>
                            </div>
                        </div>

                        {/* second colum of second row with two columns */}
                        <div className='col-span-2 grid grid-cols-2'>
                            <div className='p-3'>
                                <div className='transform transition duration-500 hover:scale-110 p-4 mb-4 text-left bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                                    <img width="48" height="32" src="https://img.icons8.com/external-solidglyph-m-oki-orlando/32/external-collaborative-customer-relationship-management-solid-solidglyph-m-oki-orlando.png" alt="external-collaborative-customer-relationship-management-solid-solidglyph-m-oki-orlando" />
                                    <h5 class="mb-2 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Collaborative Hub
                                    </h5>
                                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Fosters collaboration among students and faculty on a centralized platform, accelerating the entire thesis journey.
                                    </p>
                                </div>
                                <div className='transform transition duration-500 hover:scale-110 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700' >
                                    <img width="48" height="50" src="https://img.icons8.com/ios-filled/50/repository.png" alt="repository" />

                                    <h5 class="mb-2 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Resourceful Support
                                    </h5>
                                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Provides comprehensive materials for students and a summarizer tool for faculty, enhancing thesis experience for all involved.
                                    </p>
                                </div>
                            </div>
                            <div className='p-3'>
                                <div className='transform transition duration-500 hover:scale-110 p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700' >
                                    <img width="48" height="64" src="https://img.icons8.com/external-parzival-1997-detailed-outline-parzival-1997/64/000000/external-automated-trading-psychology-parzival-1997-detailed-outline-parzival-1997.png" alt="external-automated-trading-psychology-parzival-1997-detailed-outline-parzival-1997" />
                                    <h5 class="mb-2 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Automated Efficiency
                                    </h5>
                                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Streamlines every thesis stage, from submission to evaluation, ensuring a hassle-free process for all stakeholders.
                                    </p>
                                </div>
                                <div className='transform transition duration-500 hover:scale-110 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                                    <img width="48" height="48" src="https://img.icons8.com/fluency-systems-regular/48/task-completed.png" alt="task-completed" />
                                    <h5 class="mb-2 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Task Automation
                                    </h5>
                                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Seamlessly handles submissions, report reviews, communication, and evaluations, reducing manual workload and errors.

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Aboutsection;