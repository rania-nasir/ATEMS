const { sequelize, DataTypes } = require("../config/sequelize");
const { Faculty } = require("./faculty");

const Internal = Faculty.extend('internals', {
    internalId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
});


// Internal.belongsTo(Faculty, {
//     foreignKey: {
//         name: 'facultyId',
//         allowNull: false,
//     },
// });

sequelize.sync().then(() => {
    console.log('Internal table created successfully!');
}).catch((error) => {
    console.error('Unable to create Internal table : ', error);
});