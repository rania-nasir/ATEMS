import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function ViewStudent() {
    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        async function fetchStudentData() {
            try {
                const response = await fetch('http://localhost:5000/gc/viewStudents'); 
                if (response.ok) {
                    const data = await response.json();
                    setStudentData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchStudentData();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Students Record
                    </h2>
                </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <DataTable value={studentData} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="rollno" header="Roll Number"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="batch" header="Batch"></Column>
                    <Column field="semester" header="Semester"></Column>
                    <Column field="program" header="Program"></Column>
                    <Column field="cgpa" header="CGPA"></Column>
                </DataTable>
            </div>
        </>
    )
}
