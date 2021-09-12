const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return license_bit.init(sequelize, DataTypes);
}

class license_bit extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    license_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'license',
        key: 'license_id'
      }
    },
    bit_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'bit',
        key: 'bit_id'
      }
    }
  }, {
    sequelize,
    tableName: 'license_bit',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "license_id" },
          { name: "bit_id" },
        ]
      },
      {
        name: "bit_license_bit_fk_idx",
        using: "BTREE",
        fields: [
          { name: "bit_id" },
        ]
      },
    ]
  });
  return license_bit;
  }
}
