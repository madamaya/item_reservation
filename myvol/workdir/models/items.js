'use strict';
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
      console.log(itemId);
      Reservation.findAll({
        where: {
          itemId
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