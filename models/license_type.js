const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return license_type.init(sequelize, DataTypes);
}

class license_type extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    license_type_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'license_type',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "license_type_id" },
        ]
      },
    ]
  });
  return license_type;
  }
}
