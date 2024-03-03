const { sequelize, DataTypes } = require("../config/sequelize");

const faculties = sequelize.define("faculties", {
  facultyid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Male', 'Female']]
    }
  },
  role: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      isValidRole(value) {
        const allowedRoles = ['Supervisor', 'Internal', 'External', 'HOD', 'GC', 'MSRC'];
        for (const role of value) {
          if (!allowedRoles.includes(role)) {
            throw new Error(`Invalid role: ${role}. Role must be one of Supervisor, Internal, External, HOD, GC, MSRC`);
          }
        }
        // Check for unique "HOD" role
        const hodCount = value.filter(role => role === 'HOD').length;
        if (hodCount > 1) {
          throw new Error('Only one faculty member can have the role of HOD');
        }
        // Check for unique "GC" role
        const gcCount = value.filter(role => role === 'GC').length;
        if (hodCount > 1) {
          throw new Error('Only one faculty member can have the role of GC');
        }
      },
    },
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

sequelize.sync().then(() => {
  console.log('Faculty table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

module.exports = { faculties };
