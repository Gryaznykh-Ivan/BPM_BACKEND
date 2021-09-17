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
      {
        name: "image_bitmaker_fk_idx",
        using: "BTREE",
        fields: [
          { name: "photo" },
        ]
      },
    ]
  });
  return bitmaker;
  }
}
