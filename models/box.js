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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    price_without_discount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    income: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    opened: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    reopenable_in: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    photo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'image',
        key: 'image_id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'category',
        key: 'category_id'
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
          { name: "photo" },
        ]
      },
      {
        name: "category_box_fk_idx",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
  return box;
  }
}
