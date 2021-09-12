const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return bits_history.init(sequelize, DataTypes);
}

class bits_history extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    bits_history_id: {
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
    license_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'license_type',
        key: 'license_type_id'
      }
    },
    bit_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'bit',
        key: 'bit_id'
      }
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
    tableName: 'bits_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bits_history_id" },
        ]
      },
      {
        name: "user_bits_history_fk_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "bit_bits_history_fk_idx",
        using: "BTREE",
        fields: [
          { name: "bit_id" },
        ]
      },
      {
        name: "license_type_bits_history_fk_idx",
        using: "BTREE",
        fields: [
          { name: "license_type" },
        ]
      },
    ]
  });
  return bits_history;
  }
}
