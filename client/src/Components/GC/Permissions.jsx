import React, { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


export default function Permissions() {
    const toastTopCenter = useRef(null);

    const [proposalVisible, setProposalVisible] = useState(false);
    const [mid1Visible, setMid1Visible] = useState(false);

    const [proposalPermissionStatus, setProposalPermissionStatus] = useState(null);
    const [mid1PermissionStatus, setMid1PermissionStatus] = useState(null);

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProposalPermissionStatus();
    }, []); // Fetch status when component mounts

    const fetchProposalPermissionStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/gc/proposalEvaluationStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });
            const data = await response.json();
            const status = data.gcproposalpermission;
            setProposalPermissionStatus(status);
        } catch (error) {
            console.error('Error fetching proposal permission status:', error);
            setMessage('Failed to fetch proposal permission status');
        }
    };

    useEffect(() => {
        fetchMid1PermissionStatus();
    }, []);

    const fetchMid1PermissionStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/gc/midEvaluationStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });
            const data = await response.json();
            const status = Boolean(data.midEvaluationPermission); // Convert to boolean
            setMid1PermissionStatus(status);
        } catch (error) {
            console.error('Error fetching mid1 permission status:', error);
            setMessage('Failed to fetch mid1 permission status');
        }
    };

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, detail: label, life: 3000 });
    };

    const handleProposalTogglePermission = () => {
        setProposalVisible(true);
    };

    const handleMid1TogglePermission = () => {
        setMid1Visible(true);
    };

    const handleConfirmProposalPermission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (proposalPermissionStatus === 'Granted' || proposalPermissionStatus === null) {
                endpoint = 'http://localhost:5000/gc/revokePropEvalPermission';
                newStatus = 'Revoked';
            } else {
                endpoint = 'http://localhost:5000/gc/grantPropEvalPermission';
                newStatus = 'Granted';
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });

            const data = await response.json();
            setMessage(data.message);

            // Conditionally update the permission status based on the response message
            if (data.message === 'GC permission granted for all proposal evaluations' ||
                data.message === 'GC permission revoked for all proposal evaluations') {
                setProposalPermissionStatus(newStatus);
            }
            showMessage('success', message);

            // Close the dialog after performing the action
            setProposalVisible(false);
        } catch (error) {
            console.error('Error toggling proposal permission:', error);
            setMessage('Failed to toggle proposal permission');
        }
    };

    const handleConfirmMid1Permission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (mid1PermissionStatus === true) {
                endpoint = 'http://localhost:5000/gc/revokeMidEvalPermission';
                newStatus = 'Revoked';
            } else {
                endpoint = 'http://localhost:5000/gc/grantMidEvalPermission';
                newStatus = 'Granted';
            }


            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });

            const data = await response.json();
            setMessage(data.message);

            // Conditionally update the permission status based on the response message
            if (data.message === 'Mid-evaluation permissions successfully granted.' ||
                data.message === 'Mid-evaluation permissions revoked for all record.') {
                setMid1PermissionStatus(newStatus);
            }

            showMessage('success', message);

            // Close the dialog after performing the action
            setMid1Visible(false);
        } catch (error) {
            console.error('Error toggling mid1 permission:', error);
            setMessage('Failed to toggle mid1 permission');
        }
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Confirmation</span>
        </div>
    );

    const footerContentProposal = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmProposalPermission}
                className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );

    const footerContentMid1 = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmMid1Permission}
                className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />

            <Dialog visible={proposalVisible} modal header={headerElement} footer={footerContentProposal} style={{ width: '30rem' }} onHide={() => setProposalVisible(false)}>
                <p className="m-0">
                    Are you sure you want to {proposalPermissionStatus === 'Granted' ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>

            <Dialog visible={mid1Visible} modal header={headerElement} footer={footerContentMid1} style={{ width: '30rem' }} onHide={() => setMid1Visible(false)}>
                <p className="m-0">
                    Are you sure you want to {mid1PermissionStatus === 'Granted' ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>

            <div className='m-2 p-2 grid grid-cols-1'>
                <div className="mx-4">
                    <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
                        Evaluation Permissions
                    </h2>
                </div>
                <div className='m-4' style={{ border: '1px solid red' }}>
                    <h2 className='text-xl font-bold tracking-tight text-gray-950'>
                        Thesis 1</h2>
                    <div className='m-4' style={{ border: '1px solid blue' }}>
                        <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Defense Proposal Evaluation Permissions</h3>
                        <div className="flex justify-end px-6">
                            <button
                                onClick={handleProposalTogglePermission}
                                className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                            >
                                {proposalPermissionStatus === 'Granted' ? 'Revoke Permission' : 'Grant Permission'}
                            </button>
                        </div>
                    </div>
                    <div className='m-4' style={{ border: '1px solid blue' }}>
                        <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Mid Evaluation Permissions</h3>
                        <div className="flex justify-end px-6">
                            <button
                                onClick={handleMid1TogglePermission}
                                className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                            >
                                {mid1PermissionStatus === true ? 'Revoke Permission' : 'Grant Permission'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
























// export default function Permissions() {
//     const toastTopCenter = useRef(null);
//     const [visible, setVisible] = useState(false);

//     const [ProposalpermissionStatus, setProposalPermissionStatus] = useState(null); // 'Granted', 'Revoked', or null for initial state
//     const [Mid1permissionStatus, setMid1PermissionStatus] = useState(null); // 'Granted', 'Revoked', or null for initial state
//     // const [Final1permissionStatus, setFinal1PermissionStatus] = useState(null); // 'Granted', 'Revoked', or null for initial state
//     // const [Mid2permissionStatus, setMid2PermissionStatus] = useState(null); // 'Granted', 'Revoked', or null for initial state
//     // const [Final2permissionStatus, setFinal2PermissionStatus] = useState(null); // 'Granted', 'Revoked', or null for initial state

//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         fetchProposalPermissionStatus();
//     }, []); // Fetch status when component mounts

//     const fetchProposalPermissionStatus = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/gc/proposalEvaluationStatus', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `${Cookie.get('jwtoken')}`,
//                 }
//             });
//             const data = await response.json();
//             const status = data.gcproposalpermission;
//             setProposalPermissionStatus(status);
//         } catch (error) {
//             console.error('Error fetching permission status:', error);
//             setMessage('Failed to fetch permission status');
//         }
//     };

//     useEffect(() => {
//         fetchMid1PermissionStatus();
//     }, []); // Fetch status when component mounts

//     const fetchMid1PermissionStatus = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/gc/midEvaluationStatus', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `${Cookie.get('jwtoken')}`,
//                 }
//             });
//             const data = await response.json();
//             const status = data.midEvaluationPermission;
//             setMid1PermissionStatus(status);
//         } catch (error) {
//             console.error('Error fetching permission status:', error);
//             setMessage('Failed to fetch permission status');
//         }
//     };

//     const showMessage = (severity, label) => {
//         toastTopCenter.current.show({ severity, summary: label, detail: label, life: 3000 });
//     };


//     const handleProposalTogglePermission = () => {
//         setVisible(true);
//     };
//     const handleMid1TogglePermission = () => {
//         setVisible(true);
//     };

//     const handleConfirmProposalPermission = async () => {
//         try {
//             let endpoint = '';
//             let newStatus = '';

//             // Determine which action to perform based on current permission status
//             if (ProposalpermissionStatus === 'Granted' || ProposalpermissionStatus === null) {
//                 endpoint = 'http://localhost:5000/gc/revokePropEvalPermission';
//                 newStatus = 'Revoked';
//             } else {
//                 endpoint = 'http://localhost:5000/gc/grantPropEvalPermission';
//                 newStatus = 'Granted';
//             }

//             const response = await fetch(endpoint, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `${Cookie.get('jwtoken')}`,
//                 }
//             });

//             const data = await response.json();
//             setMessage(data.message);
//             setProposalPermissionStatus(newStatus);
//             showMessage('success', message);

//             // Close the dialog after performing the action
//             setVisible(false);
//         } catch (error) {
//             console.error('Error toggling permission:', error);
//             setMessage('Failed to toggle permission');
//         }
//     };


//     const handleConfirmMid1Permission = async () => {
//         try {
//             let endpoint = '';
//             let newStatus = '';

//             // Determine which action to perform based on current permission status
//             if (Mid1permissionStatus === 'Granted' || Mid1permissionStatus === null) {
//                 endpoint = 'http://localhost:5000/gc/revokeMidEvalPermission';
//                 newStatus = 'Revoked';
//             } else {
//                 endpoint = 'http://localhost:5000/gc/grantMidEvalPermission';
//                 newStatus = 'Granted';
//             }

//             const response = await fetch(endpoint, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `${Cookie.get('jwtoken')}`,
//                 }
//             });

//             const data = await response.json();
//             setMessage(data.message);
//             setMid1PermissionStatus(newStatus);
//             showMessage('success', message);

//             // Close the dialog after performing the action
//             setVisible(false);
//         } catch (error) {
//             console.error('Error toggling permission:', error);
//             setMessage('Failed to toggle permission');
//         }
//     };

//     const headerElement = (
//         <div className="inline-flex align-items-center justify-content-center gap-2">
//             <span className="font-bold white-space-nowrap">Confirmation</span>
//         </div>
//     );

//     const footerContentProposal = (
//         <div>
//             <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmProposalPermission}
//                 className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
//         </div>
//     );

//     const footerContentMid1 = (
//         <div>
//             <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmMid1Permission}
//                 className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
//         </div>
//     );


//     return (
//         <>
//             <Toast ref={toastTopCenter} position="top-center" />
//             <Dialog visible={visible} modal header={headerElement} footer={footerContentProposal} style={{ width: '30rem' }} onHide={() => setVisible(false)}>
//                 <p className="m-0">
//                     Are you sure you want to {ProposalpermissionStatus === 'Granted' ? 'revoke' : 'grant'} the permission?
//                 </p>
//             </Dialog>

//             <Dialog visible={visible} modal header={headerElement} footer={footerContentMid1} style={{ width: '30rem' }} onHide={() => setVisible(false)}>
//                 <p className="m-0">
//                     Are you sure you want to {Mid1permissionStatus === 'Granted' ? 'revoke' : 'grant'} the permission?
//                 </p>
//             </Dialog>

//             <div className='m-2 p-2 grid grid-cols-1'>
//                 <div className="mx-4">
//                     <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
//                         Evaluation Permissions
//                     </h2>
//                 </div>
//                 <div className='m-4' style={{ border: '1px solid red' }}>

//                     <h2 className='text-xl font-bold tracking-tight text-gray-950'>
//                         Thesis 1</h2>

//                     <div className='m-4'
//                         style={{ border: '1px solid blue' }}>
//                         <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Defense Proposal Evaluation Permissions</h3>
//                         <div className="flex justify-end px-6">
//                             <button
//                                 onClick={handleProposalTogglePermission}
//                                 className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
//                             >
//                                 {ProposalpermissionStatus === 'Granted' ? 'Revoke Permission' : 'Grant Permission'}
//                             </button>
//                         </div>
//                     </div>
//                     <div className='m-4'
//                         style={{ border: '1px solid blue' }}>
//                         <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Mid Evaluation Permissions</h3>
//                         <div className="flex justify-end px-6">
//                             <button
//                                 onClick={handleMid1TogglePermission}
//                                 className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
//                             >
//                                 {Mid1permissionStatus === 'Granted' ? 'Revoke Permission' : 'Grant Permission'}
//                             </button>
//                         </div>
//                     </div>
//                     {/* <div className='m-4'
//                         style={{ border: '1px solid blue' }}>
//                         <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Final Evaluation Permissions</h3>
//                         <div className="flex justify-end px-6">
//                             <button
//                                 // onClick={handleTogglePermission}
//                                 className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
//                             >
//                                 {Final1permissionStatus === 'Granted' ? 'Revoke Permission' : 'Grant Permission'}
//                             </button>
//                         </div>
//                     </div> */}

//                 </div>
//                 {/* <div className='m-4' style={{ border: '1px solid red' }}>

//                     <h2 className='text-xl font-bold tracking-tight text-gray-950'>
//                         Thesis 2</h2>

//                     <div className='m-4'
//                         style={{ border: '1px solid blue' }}>
//                         <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Mid Evaluation Permissions</h3>
//                         <div className="flex justify-end px-6">
//                             <button
//                                 // onClick={handleTogglePermission}
//                                 className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
//                             >
//                                 {Mid2permissionStatus === 'Granted' ? 'Revoke Permission' : 'Grant Permission'}
//                             </button>
//                         </div>
//                     </div>
//                     <div className='m-4'
//                         style={{ border: '1px solid blue' }}>
//                         <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Final Evaluation Permissions</h3>
//                         <div className="flex justify-end px-6">
//                             <button
//                                 // onClick={handleTogglePermission}
//                                 className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
//                             >
//                                 {Final2permissionStatus === 'Granted' ? 'Revoke Permission' : 'Grant Permission'}
//                             </button>
//                         </div>
//                     </div>

//                 </div> */}
//             </div>
//         </>
//     )
// }
