const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return replenishment_history.init(sequelize, DataTypes);
}

class replenishment_history extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    replenishment_history_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'replenishment_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "replenishment_history_id" },
        ]
      },
      {
        name: "user_replenishment_history_fk_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  return replenishment_history;
  }
}
