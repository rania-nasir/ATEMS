const { repository } = require("../../model/repository.model");

const getRepository = async (req, res) => {
    try {
        const allThesis = await repository.findAll();

        res.json(allThesis);
    } catch (error) {
        console.error('Error loading repository:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getRepository };