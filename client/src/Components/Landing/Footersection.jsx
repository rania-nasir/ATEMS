import React from "react";
import { NavLink } from "react-router-dom";
import Logo from '../../Images/atems-logo.png';

const Footersection = () => {
    return(
        <>
            <footer class="mt-10 pt-10">
                        <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8 lg:px-6">
                            <div class="md:flex md:justify-between">
                                <div class="mb-6 md:mb-0">
                                    <NavLink to="{{< param homepage >}}/" class="flex items-center">
                                        <img src={Logo} class="h-20 me-3" alt="ATEMS Logo" />
                                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ATEMS</span>
                                    </NavLink>
                                </div>
                                <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">

                                    <div>
                                        <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">USEFUL LINKS</h2>
                                        <ul class="text-gray-500 dark:text-gray-400 font-medium">
                                            <li class="mb-4">
                                                <NavLink to="https://github.com/themesberg/flowbite" class="hover:underline ">Facebook</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="https://discord.gg/4eeurUVvTy" class="hover:underline">Twitter</NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">OTHER RESOURCES</h2>
                                        <ul class="text-gray-500 dark:text-gray-400 font-medium">
                                            <li class="mb-4">
                                                <NavLink to="#" class="hover:underline">About</NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="#" class="hover:underline">Contact Us</NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <hr class="my-6 border-gray-300 sm:mx-auto dark:border-gray-700 lg:my-8" />
                            <div class="sm:flex sm:items-center sm:justify-between">
                                <span class="block text-sm text-gray-600 sm:text-center dark:text-gray-500">2023-24 <NavLink to="#" class="hover:underline">ATEMS</NavLink>. Designed by <NavLink to="#" class="hover:underline">ATEMERS </NavLink></span>
                                <div class="flex mt-4 justify-around sm:mt-0 flex-row items-center w-[80px]">
                                    <NavLink to="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 8 19">
                                            <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd" />
                                        </svg>
                                        <span class="sr-only">Facebook page</span>
                                    </NavLink>
                                    <NavLink to="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 20 17">
                                            <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd" />
                                        </svg>
                                        <span class="sr-only">Twitter page</span>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </footer>
        </>
    )
}

export default Footersection;