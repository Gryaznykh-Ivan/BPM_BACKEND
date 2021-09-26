const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return file.init(sequelize, DataTypes);
}

class file extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    file_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    license_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'license_type',
        key: 'license_type_id'
      }
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bit_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'bit',
        key: 'bit_id'
      }
    }
  }, {
    sequelize,
    tableName: 'file',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "file_id" },
        ]
      },
      {
        name: "bit_file_fk_idx",
        using: "BTREE",
        fields: [
          { name: "bit_id" },
        ]
      },
      {
        name: "license_type_file_fk_idx",
        using: "BTREE",
        fields: [
          { name: "license_type" },
        ]
      },
    ]
  });
  return file;
  }
}
