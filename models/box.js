const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return box.init(sequelize, DataTypes);
}

class box extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    case_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    image: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'image',
        key: 'image_id'
      }
    }
  }, {
    sequelize,
    tableName: 'box',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "case_id" },
        ]
      },
      {
        name: "image_box_fk_idx",
        using: "BTREE",
        fields: [
          { name: "image" },
        ]
      },
    ]
  });
  return box;
  }
}
