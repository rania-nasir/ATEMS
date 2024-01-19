import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie'

export var Fdata = [];

export default function SynopsisForm() {
 
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchFacultyData() {
            try {
                const response = await fetch('http://localhost:5000/std/synopsisForm', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.allfaculties);

                    // Extracting only the names from allFaculties
                    const names = data.allFaculties.map(faculty => faculty.name);
                    Fdata = names; // Update the exported FacultyData
                    
                    console.log('Synopsis form Fdata : ',Fdata);
                    
                    navigate('/fillSynopsis');
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchFacultyData();
    }, []); // Empty dependency array to execute only once on component mount

    console.log('Synopsis form Fdata : ',Fdata);

    return (
        <>
           
        </>
    )
    
}

