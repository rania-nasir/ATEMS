const { sequelize } = require("../../config/sequelize");
const { students } = require("../../model/student.model");
const { faculties } = require("../../model/faculty.model");
const { synopsis } = require("../../model/synopsis.model");

/*Synopsis Controller*/

// get the list of faculties in the system
const getFaculties = async () => {
    try {
        // Fetch all faculties
        const allFaculties = await faculties.findAll({
            attributes: ['facultyid', 'name'],
        });

        return allFaculties;
    } catch (error) {
        console.error('Error fetching faculties:', error);
        throw error;
    }
};

// This function will send the list of faculties registered in the system to the frontend
const sendFaculties = async (req, res) => {
    try {
        const allFaculties = await getFaculties();

        res.render('synopisForm', {
            allFaculties,
        });

    } catch (error) {
        console.error('Error loading synopsis form:', error);
        res.status(500).json({ error: 'Internal server error 1' }); // error 1 for this function
    }
};

const fillSynopsis = async (req, res) => {
    try {
        const synopsistitle = req.body.synopsistitle;
        const description = req.body.description;
        const facultyname = req.body.facultyname;

        //console.log('passed 1');
        const faculty = await faculties.findOne({
            where: {
                name: facultyname,
            },
            attributes: ['facultyid'],
        });


        //console.log('passed 2');
        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        const facultyid = faculty.facultyid;

        //console.log('passed 3');

        const newSynopsis = await synopsis.create({
            synopsistitle,
            description,
            facultyid,
            facultyname: facultyname,
            // rollno: 5, dummy for testing

        });

        res.status(200).json({ message: 'Synopsis created successfully', synopsis: newSynopsis });


    } catch (error) {
        console.error('Error processing synopsis form:', error);
        res.status(500).json({ error: 'Internal server error 2' }); // error 2 for this function
    }
}

// export the 2 functions required
module.exports = { fillSynopsis, sendFaculties };
