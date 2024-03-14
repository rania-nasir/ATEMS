import React from 'react';

export default function Evaluations() {

    return (
        <>
            <div className='m-2 p-2 grid grid-cols-1'>
                <div className="mx-4">
                    <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
                        Evaluations
                    </h2>
                </div>
                <div className="m-6 shadow-md sm:rounded-lg col-span-1">
                    <table
                        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Thesis ID
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Thesis Title
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Roll Number
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Supervisor Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    #1
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    #ATEMS
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    #20F-0310
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    #M. Fayyaz
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
