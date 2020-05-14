'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Reservation = loader.database.define('reservation', {
  reservationId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  itemId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  startTime: {
    type: Sequelize.STRING,
    allowNull: false
  },
  endTime: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  reservedBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  valid: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Reservation;