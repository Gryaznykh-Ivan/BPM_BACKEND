const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return bitmaker.init(sequelize, DataTypes);
}

class bitmaker extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    bitmaker_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bitmaker',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bitmaker_id" },
        ]
      },
    ]
  });
  return bitmaker;
  }
}
