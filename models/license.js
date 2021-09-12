const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return license.init(sequelize, DataTypes);
}

class license extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    license_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'license_type',
        key: 'license_type_id'
      }
    },
    case_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'box',
        key: 'case_id'
      }
    },
    probability: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'license',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "license_id" },
        ]
      },
      {
        name: "case_license_fk_idx",
        using: "BTREE",
        fields: [
          { name: "case_id" },
        ]
      },
      {
        name: "license_type_license_fk_idx",
        using: "BTREE",
        fields: [
          { name: "type" },
        ]
      },
    ]
  });
  return license;
  }
}
