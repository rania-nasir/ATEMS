import React, { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


export default function Permissions() {
    const toastTopCenter = useRef(null);
    const [visible, setVisible] = useState(false);

    const [permissionStatus, setPermissionStatus] = useState(null); // 'Granted', 'Revoked', or null for initial state
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPermissionStatus();
    }, []); // Fetch status when component mounts

    const fetchPermissionStatus = async () => {
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
            setPermissionStatus(status);
        } catch (error) {
            console.error('Error fetching permission status:', error);
            setMessage('Failed to fetch permission status');
        }
    };

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, detail: label, life: 3000 });
    };

    const handleTogglePermission = () => {
        setVisible(true);
    };

    const handleConfirmPermission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (permissionStatus === 'Granted' || permissionStatus === null) {
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
            setPermissionStatus(newStatus);
            showMessage('success', message);

            // Close the dialog after performing the action
            setVisible(false);
        } catch (error) {
            console.error('Error toggling permission:', error);
            setMessage('Failed to toggle permission');
        }
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Confirmation</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmPermission}
            className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );


    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '30rem' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Are you sure you want to {permissionStatus === 'Granted' ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>
            <div className='m-2 p-2 grid grid-cols-1'>
                <div className="mx-4">
                    <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
                        Evaluation Permissions
                    </h2>
                </div>
                <div className="flex justify-end px-6">
                    <button
                        onClick={handleTogglePermission}
                        className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                    >
                        {permissionStatus === 'Granted' ? 'Revoke Permission' : 'Grant Permission'}
                    </button>
                </div>
            </div>
        </>
    )
}
