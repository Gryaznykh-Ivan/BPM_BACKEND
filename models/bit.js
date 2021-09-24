const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return bit.init(sequelize, DataTypes);
}

class bit extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    bit_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    author: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'bitmaker',
        key: 'bitmaker_id'
      }
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    belongs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    photo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'image',
        key: 'image_id'
      }
    }
  }, {
    sequelize,
    tableName: 'bit',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bit_id" },
        ]
      },
      {
        name: "bitmaker_bit_fk_idx",
        using: "BTREE",
        fields: [
          { name: "author" },
        ]
      },
      {
        name: "image_bit_fk_idx",
        using: "BTREE",
        fields: [
          { name: "photo" },
        ]
      },
    ]
  });
  return bit;
  }
}
