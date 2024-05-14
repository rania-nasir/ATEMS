import React, { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function T2Permissions() {
    const toastTopCenter = useRef(null);

    const [mid2Visible, setMid2Visible] = useState(false);
    const [mid2PermissionStatus, setMid2PermissionStatus] = useState(false); // Changed initial value to false

    const [final2Visible, setFinal2Visible] = useState(false);
    const [final2PermissionStatus, setFinal2PermissionStatus] = useState(false); // Changed initial value to false

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMid2PermissionStatus();
    }, []);
    useEffect(() => {
        fetchFinal2PermissionStatus();
    }, []);

    const fetchMid2PermissionStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/gc/mid2EvaluationStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });
            const data = await response.json();
            const status = Boolean(data.gcmidevalpermission); // Changed to match server response
            setMid2PermissionStatus(status);
        } catch (error) {
            console.error('Error fetching mid2 permission status:', error);
            setMessage('Failed to fetch mid2 permission status');
        }
    };

    const fetchFinal2PermissionStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/gc/final2EvaluationStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });
            const data = await response.json();
            const status = Boolean(data.gcfinalevalpermission); // Changed to match server response
            setFinal2PermissionStatus(status);
        } catch (error) {
            console.error('Error fetching Final2 permission status:', error);
            setMessage('Failed to fetch Final2 permission status');
        }
    };

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    const handleMid2TogglePermission = () => {
        setMid2Visible(true);
    };
    const handleFinal2TogglePermission = () => {
        setFinal2Visible(true);
    };

    const handleConfirmMid2Permission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (mid2PermissionStatus === true) {
                endpoint = 'http://localhost:5000/gc/revokeMid2EvalPermission'; // Modified endpoint
                newStatus = false; // Changed to false
            } else {
                endpoint = 'http://localhost:5000/gc/grantMid2EvalPermission'; // Modified endpoint
                newStatus = true; // Changed to true
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });

            const data = await response.json();

            // Conditionally update the permission status based on the response message
            if (data.message === 'Mid 2 evaluation permission granted for all records' ||
                data.message === 'Mid 2 Evaluation permission revoked for all records') {
                setMid2PermissionStatus(newStatus); // Updated status
                showMessage('success', data.message);
            }
            else{
                showMessage('info', data.message);
            }

            // Close the dialog after performing the action
            setMid2Visible(false);
        } catch (error) {
            console.error('Error toggling mid2 permission:', error);
            setMessage('Failed to toggle mid2 permission');
        }
    };

    const handleConfirmFinal2Permission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (final2PermissionStatus === true) {
                endpoint = 'http://localhost:5000/gc/revokeFinal2EvalPermission'; // Modified endpoint
                newStatus = false; // Changed to false
            } else {
                endpoint = 'http://localhost:5000/gc/grantFinal2EvalPermission'; // Modified endpoint
                newStatus = true; // Changed to true
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });

            const data = await response.json();

            // Conditionally update the permission status based on the response message
            if (data.message === 'Final 2 evaluation permission granted for all records' ||
                data.message === 'Final 2 Evaluation permission revoked for all records') {
                setFinal2PermissionStatus(newStatus); // Updated status
                showMessage('success', data.message);
            }
            else{
                showMessage('info', data.message);
            }

            // Close the dialog after performing the action
            setFinal2Visible(false);
        } catch (error) {
            console.error('Error toggling final2 permission:', error);
            setMessage('Failed to toggle final2 permission');
        }
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Confirmation</span>
        </div>
    );

    const footerContentMid2 = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmMid2Permission}
                className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );

    const footerContentFinal2 = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmFinal2Permission}
                className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />

            <Dialog visible={mid2Visible} modal header={headerElement} footer={footerContentMid2} style={{ width: '30rem' }} onHide={() => setMid2Visible(false)}>
                <p className="m-0">
                    Are you sure you want to {mid2PermissionStatus === true ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>

            <Dialog visible={final2Visible} modal header={headerElement} footer={footerContentFinal2} style={{ width: '30rem' }} onHide={() => setFinal2Visible(false)}>
                <p className="m-0">
                    Are you sure you want to {final2PermissionStatus === true ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>

            <div className='m-2 p-2 grid grid-cols-1'>
                <div className="mx-4">
                    <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
                        Evaluation Permissions
                    </h2>
                </div>
                <div className='mx-4'>
                    <h2 className='my-6 text-xl font-semibold tracking-tight text-gray-950'>
                        Thesis 2 Evaluation Permissions</h2>
                    <div className='m-4'>
                        <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Mid Evaluation Permissions</h3>
                        <div className="flex justify-end px-6">
                            <button
                                onClick={handleMid2TogglePermission}
                                className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                            >
                                {mid2PermissionStatus === true ? 'Revoke Permission' : 'Grant Permission'}
                            </button>
                        </div>
                    </div>
                    <div className='m-4'>
                        <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Final Evaluation Permissions</h3>
                        <div className="flex justify-end px-6">
                            <button
                                onClick={handleFinal2TogglePermission}
                                className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                            >
                                {final2PermissionStatus === true ? 'Revoke Permission' : 'Grant Permission'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
