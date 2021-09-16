const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return image.init(sequelize, DataTypes);
}

class image extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    image_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'image',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
    ]
  });
  return image;
  }
}
