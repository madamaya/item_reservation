'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Item = loader.database.define('item', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  comment: {
    type: Sequelize.TEXT
  },
  createdAt: {
    type: Sequelize.DATE
  },
  createdBy: {
    type: Sequelize.INTEGER
  },
  valid: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Item;