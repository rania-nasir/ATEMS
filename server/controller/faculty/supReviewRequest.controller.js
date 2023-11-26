const { sequelize } = require("../../config/sequelize");
const { synopsis } = require("../../model/synopsis.model");
const { thesis } = require("../../model/thesis.model");


/* Supervisor Review Requests Controller */
/* Review Requests using synopsis submitted by Students */

const getSynopsis = async (req, res) => {
    try {
        // fetch all synopsis for the logged in supervisor
        const facultyId = req.user.id; // obtain the logged in faculty id.

        const allSynopsis = await synopsis.findAll({
            where: {
                facultyId: facultyId,
                status: 'Pending'
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
        const facultyId = req.user.id; // obtain the logged in faculty id.

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
        const facultyId = req.user.id;

        await synopsis.update(
            { synopsisstatus: 'Approved' },
            { where: { synopsisid: synopsisId, facultyid: facultyId } }
        );

        res.json({ message: 'Synopsis approved succesfully' });

    } catch (error) {
        console.error('Error approving synopsis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const declineSynopsis = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = req.user.id;
        // const { reason } = req.body; if we want to send a reason

        await synopsis.update(
            { synopsisstatus: 'Rejected' },
            { where: { synopsisid: synopsisId, facultyid: facultyId } }
        );

        res.json({ message: 'Synopsis rejected succesfully' });

    } catch (error) {
        console.error('Error declining synopsis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const selectInternalMembers = async (req, res) => {
    try {
        const { synopsisId } = req.params;
        const facultyId = req.user.id;
        const { internal1, internal2 } = req.body;

        const selectedSynopsis = await synopsis.findOne({
            where: {
                synopsisid: synopsisId,
                facultyid: facultyId
            },
        });

        const newThesis = await thesis.create({
            thesistitle: selectedSynopsis.synopsistitle,
            description: selectedSynopsis.description,
            rollno: selectedSynopsis.rollno,
            facultyid: selectedSynopsis.facultyid,
            internals: [internal1, internal2]
        });

        res.json({ message: 'Internal members selected succesfully', thesis: newThesis });
    } catch (error) {
        console.error('Error selecting internal members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getSynopsis, getSynopsisDetails, approveSynopsis, declineSynopsis, selectInternalMembers };
