import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Cookie from 'js-cookie'


export default function ViewFaculty() {
    const [FacultyData, setFacultyData] = useState([]);

    useEffect(() => {
        async function fetchFacultyData() {
            try {
                const response = await fetch('http://localhost:5000/gc/viewFaculty', {headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                }}); 
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setFacultyData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchFacultyData();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Faculty Record
                    </h2>
                </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <DataTable value={FacultyData} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="facultyid" header="Faculty IDr"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="email" header="Email"></Column>
                </DataTable>
            </div>
        </>
    )
}
