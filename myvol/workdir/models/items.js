'use strict';
const { Op } = require("sequelize");
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const Reservation = require('./reservation');
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
  timestamps: false,
  hooks: {
    afterBulkUpdate: (options) => {
      const itemId = options.where.id;
      const now = require('../routes/parseTime')(new Date(new Date().getTime() + 9 * 60 * 60 * 1000));
      console.log('hook now:' + now);
      Reservation.findAll({
        where: {
          [Op.and]: [
            {
              itemId
            },
            {
              startTime: {
                [Op.gt]: now
              }
            }
          ]
        }
      }).then((reservations) => {
        console.log('hook:' + JSON.stringify(reservations));
        let promiseList = [];
        for (let i = 0; i < reservations.length; i++) {
          console.log(i + ':' + reservations[i]);
          promiseList.push(reservations[i].update({ valid: 0 }));
        }
        Promise.all(promiseList).then(() => { });
      });
    }
  }
});

module.exports = Item;