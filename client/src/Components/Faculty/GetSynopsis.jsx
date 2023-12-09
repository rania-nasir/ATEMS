import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Cookie from 'js-cookie';
// export default function GetSynopsis() {
//     const [synopsisData, setsynopsisData] = useState([]);

//     useEffect(() => {
//         async function fetchSynopsisData() {
//             try {
//                 const response = await fetch('http://localhost:5000/faculty/supAllRequests', {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `${Cookie.get('jwtoken')}`
//                     }
//                 });
//                 if (response.ok) {
//                     const data = await response.json();
//                     setsynopsisData(Array.isArray(data) ? data : []); // Ensure data is an array

//                     console.log('Synopsis Data -> ', data)
//                 } else {
//                     throw new Error('Failed to fetch data');
//                 }
//             } catch (error) {
//                 console.error('Failed to retrieve data: ', error);
//             }
//         }

//         fetchSynopsisData();
//     }, []);

//     return (
//         <>
//             <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//                 <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
//                     Synopsis Requests
//                 </h2>
//             </div>
//             <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//                 {Array.isArray(synopsisData) && synopsisData.length > 0 ? (
//                     <DataTable value={synopsisData} stripedRows tableStyle={{ minWidth: '50rem' }}>
//                         <Column field="synopsistitle" header="Synopsis Title"></Column>
//                         <Column field="rollno" header="Roll Number"></Column>
//                         <Column field="synopsisstatus" header="Batch"></Column>
//                     </DataTable>
//                 ) : (
//                     <p>No synopsis data available</p>
//                 )}
//             </div>
//         </>
//     )
// }
export default function GetSynopsis() {
    const [synopsisData, setSynopsisData] = useState({ allSynopsis: [] });

    useEffect(() => {
        async function fetchSynopsisData() {
            try {
                const response = await fetch('http://localhost:5000/faculty/supAllRequests', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSynopsisData(data);

                    console.log('Synopsis Data -> ', data)

                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchSynopsisData();
    }, []);

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Synopsis Requests
                </h2>
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                {synopsisData.allSynopsis && synopsisData.allSynopsis.length > 0 ? (
                    <DataTable value={synopsisData.allSynopsis} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="synopsistitle" header="Synopsis Title"></Column>
                        <Column field="description" header="Description"></Column>
                        {/* <Column field="rollno" header="Student Roll Number"></Column>
                        <Column field="synopsisstatus" header="Status"></Column> */}
                    </DataTable>
                ) : (
                    <p>No synopsis data available</p>
                )}
            </div>
        </>
    )
}
