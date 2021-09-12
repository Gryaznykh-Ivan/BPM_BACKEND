const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return faq.init(sequelize, DataTypes);
}

class faq extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    faq_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'faq',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "faq_id" },
        ]
      },
    ]
  });
  return faq;
  }
}
