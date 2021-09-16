const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return support.init(sequelize, DataTypes);
}

class support extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    support_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'support',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "support_id" },
        ]
      },
    ]
  });
  return support;
  }
}
