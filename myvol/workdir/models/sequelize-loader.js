'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://user:pass@postgresql:5432/item_reservation'
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};