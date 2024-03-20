const { sequelize } = require("../../../config/sequelize");
const { registrations } = require("../../../model/thesistwo/registration.model");
const { Op } = require('sequelize');


const getThesisTwoRegRequests = async (req, res) => {
    try {
        const pendingRequests = await registrations.findAll({
            where: {
                gcapproval: 'Pending',
                supervisorapproval: 'Approved'
            },
            attributes: ['rollno', 'stdname', 'thesistitle', 'internals']
        });

        res.json({ pendingRequests });

    } catch (error) {
        console.error('Error getting thesis two registration requests:', error);
        res.status(500).json({ message: 'An error occurred while fetching the requests' });
    }
};

const getThesisTwoRegRequestDetails = async (req, res) => {
    try {
        const { rollno } = req.params;

        const studentDetails = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Approved'
            }
        });

        if (!studentDetails) {
            return res.status(404).json({ message: 'No approved request found for this student' });
        }

        res.json({ studentDetails });
    } catch (error) {
        console.error('Error getting thesis two registration request details:', error);
        res.status(500).json({ message: 'An error occurred while fetching the request details' });
    }
};


const approveThesisTwoRegRequest = async (req, res) => {
    try {
        const { rollno } = req.params;

        const studentRegistration = await registrations.findOne({
            where: {
                rollno: rollno,
                supervisorapproval: 'Approved',
                gcapproval: 'Pending'
            }
        });

        if (!studentRegistration) {
            return res.status(404).json({ message: 'No pending request found for this student' });
        }


        await studentRegistration.update({
            gcapproval: 'Approved'
        });

        res.json({ message: 'Request approved successfully' });

    } catch (error) {
        console.error('Error approving thesis two registration request:', error);
        res.status(500).json({ message: 'An error occurred while approving the request' });
    }

};



const grantMidEvalPermission = async (req, res) => {
    try {
        const records = await registrations.findAll(); // Fetch all records from the registrations table

        let allRecordsApproved = true; // Flag to track if all records have the required approvals

        for (const record of records) {
            if (record.supervisorapproval !== 'Approved' || record.gcapproval !== 'Approved' || record.hodapproval !== 'Approved') {
                allRecordsApproved = false;
                break; // Exit the loop as soon as we find a record with pending approval
            }
        }

        if (allRecordsApproved) {
            await registrations.update(
                { gcmidevalpermission: true },
                { where: {} } // Update all records
            );

            res.json({ message: 'Mid-evaluation permission granted for all records' });
        } else {
            res.json({ message: 'Some registrations are pending for relevant approvals' });
        }
    } catch (error) {
        console.error('Error granting mid-evaluation permission:', error);
        res.status(500).json({ message: 'An error occurred while granting mid-evaluation permission' });
    }
}




const revokeMidEvalPermission = async (req, res) => {
    try {
        await registrations.update({
            gcmidevalpermission: false
        }, {
            where: {} 
        });

        res.json({ message: 'Mid-Evaluation permission revoked for all records' });

    } catch (error) {

        console.error('Error revoking mid-evaluation permission:', error);
        res.status(500).json({ message: 'An error occurred while revoking mid-evaluation permission' });
    }
}



const getGCMidPermissionStatus = async (req, res) => {
    try {
        const record = await registrations.findOne(); 

        if (record) {
            res.json({ gcmidevalpermission: record.gcmidevalpermission });

        } else {
            res.json({ message: 'No records found' });
        }

    } catch (error) {
        
        console.error('Error getting mid-evaluation permission status:', error);
        res.status(500).json({ message: 'An error occurred while getting the permission status' });
    }
}

module.exports =
{
    getThesisTwoRegRequests,
    getThesisTwoRegRequestDetails,
    approveThesisTwoRegRequest,
    grantMidEvalPermission,
    revokeMidEvalPermission,
    getGCMidPermissionStatus
}