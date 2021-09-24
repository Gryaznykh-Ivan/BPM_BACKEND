const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return box_history.init(sequelize, DataTypes);
}

class box_history extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    box_history_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    case_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'box',
        key: 'case_id'
      }
    }
  }, {
    sequelize,
    tableName: 'box_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "box_history_id" },
        ]
      },
      {
        name: "box_box_history_fk_idx",
        using: "BTREE",
        fields: [
          { name: "case_id" },
        ]
      },
    ]
  });
  return box_history;
  }
}
