const { sequelize } = require("../../config/sequelize");
const { synopsis } = require("../../model/synopsis.model");
const { thesis } = require("../../model/thesis.model");
const { faculties } = require("../../model/faculty.model");


/* Supervisor Review Requests Controller */
/* Review Requests using synopsis submitted by Students */

const getSynopsis = async (req, res) => {
    try {
        // fetch all synopsis for the logged in supervisor
        const facultyId = 4455; // obtain the logged in faculty id.

        const allSynopsis = await synopsis.findAll({
            where: {
                facultyid: facultyId,
                synopsisstatus: 'Pending'
            },
            attributes: ['synopsisid', 'synopsistitle', 'description'],
        });

        res.json({ allSynopsis });

    } catch (error) {
        console.error('Error fetching synopsis for review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getSynopsisDetails = async (req, res) => {
    try {
        // Faculty will choose an id for review
        const { synopsisId } = req.params;
        const facultyId = 4455; // obtain the logged in faculty id.

        const selectedSynopsis = await synopsis.findOne({
            where: {
                synopsisid: synopsisId,
                facultyid: facultyId
            },
        });

        if (!selectedSynopsis) {
            return res.status(404).json({ error: 'Synopsis not found' });
        }

        res.json({ selectedSynopsis });
    } catch (error) {
        console.error('Error fetching synopsis details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const approveSynopsis = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = 4455;

        const [rowsAffected, [updatedSynopsis]] = await synopsis.update(
            {
                synopsisstatus: 'Approved'
            },
            {
                where:
                {
                    synopsisid: synopsisId,
                    facultyid: facultyId
                },
                returning: true,
            }
        );

        if (rowsAffected === 0) {
            return res.status(404).json({ error: 'Synopsis not found or not authorized for approval' });
        }

        res.json({ message: 'Synopsis approved succesfully', updatedSynopsis });

    } catch (error) {
        console.error('Error approving synopsis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const declineSynopsis = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = 4455;
        // const { reason } = req.body; if we want to send a reason

        const [rowsAffected, [updatedSynopsis]] = await synopsis.update(
            {
                synopsisstatus: 'Rejected'
            },
            {
                where:
                {
                    synopsisid: synopsisId,
                    facultyid: facultyId
                },
                returning: true,
            }
        );

        if (rowsAffected === 0) {
            return res.status(404).json({ error: 'Synopsis not found or not authorized for rejection' });
        }

        res.json({ message: 'Synopsis rejected succesfully', updatedSynopsis });

    } catch (error) {
        console.error('Error declining synopsis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const selectInternalMembers = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = 4455;
        const { internal1, internal2 } = req.body;

        const selectedSynopsis = await synopsis.findOne({
            where: {
                synopsisid: synopsisId,
                facultyid: facultyId
            },
        });
        console.log("Passed 2");
        if (!selectedSynopsis) {
            return res.status(404).json({ error: 'Synopsis not found or not authorized' });
        }

        const facultyList = await faculties.findAll({
            attributes: ['facultyid', 'name'],
        }); // show the list of available faculty on frontend

        const internal1id = facultyList.find(faculty => faculty.name === internal1)?.facultyid;
        const internal2id = facultyList.find(faculty => faculty.name === internal2)?.facultyid;

        if (!internal1id || !internal2id) {
            return res.status(400).json({ error: 'Invalid internal faculty names' });
        }

        //validating that supervisor and internal members are not the same
        if (facultyId === internal1id || facultyId === internal2id || internal1id === internal2id) {
            return res.status(400).json({ error: 'Supervisor and Internals must be different for a thesis' });
        }

        const newThesis = await thesis.create({
            thesistitle: selectedSynopsis.synopsistitle,
            description: selectedSynopsis.description,
            rollno: selectedSynopsis.rollno,
            facultyid: selectedSynopsis.facultyid,
            internals: [internal1, internal2],
            internalsid: [internal1id, internal2id]
        });

        res.json({ message: 'Internal members selected succesfully', thesis: newThesis });
    } catch (error) {
        console.error('Error selecting internal members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getSynopsis, getSynopsisDetails, approveSynopsis, declineSynopsis, selectInternalMembers };
