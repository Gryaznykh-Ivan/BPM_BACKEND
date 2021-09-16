const sequelize = require('../db')
const DataTypes = require("sequelize").DataTypes;
const Bit = require("./bit")(sequelize, DataTypes);
const Bitmaker = require("./Bitmaker")(sequelize, DataTypes);
const Bits_history = require("./Bits_history")(sequelize, DataTypes);
const Box = require("./Box")(sequelize, DataTypes);
const Faq = require("./Faq")(sequelize, DataTypes);
const License = require("./License")(sequelize, DataTypes);
const License_bit = require("./License_bit")(sequelize, DataTypes);
const License_type = require("./License_type")(sequelize, DataTypes);
const Refresh_token = require("./Refresh_token")(sequelize, DataTypes);
const Replenishment_history = require("./Replenishment_history")(sequelize, DataTypes);
const Support = require("./support")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const Image = require("./Image")(sequelize, DataTypes);

Bit.belongsToMany(License, { as: 'License_id_Licenses', through: License_bit, foreignKey: "bit_id", otherKey: "License_id" });
License.belongsToMany(Bit, { as: 'bit_id_bits', through: License_bit, foreignKey: "License_id", otherKey: "bit_id" });
Bits_history.belongsTo(Bit, { as: "bit", foreignKey: "bit_id" });
Bit.hasMany(Bits_history, { as: "bits_histories", foreignKey: "bit_id" });
License_bit.belongsTo(Bit, { as: "bit", foreignKey: "bit_id" });
Bit.hasMany(License_bit, { as: "License_bits", foreignKey: "bit_id" });
Bit.belongsTo(Bitmaker, { as: "author_Bitmaker", foreignKey: "author" });
Bitmaker.hasMany(Bit, { as: "bits", foreignKey: "author" });
License.belongsTo(Box, { as: "case", foreignKey: "case_id" });
Box.hasMany(License, { as: "Licenses", foreignKey: "case_id" });
License_bit.belongsTo(License, { as: "License", foreignKey: "License_id" });
License.hasMany(License_bit, { as: "License_bits", foreignKey: "License_id" });
Bits_history.belongsTo(License_type, { as: "License_type_License_type", foreignKey: "License_type" });
License_type.hasMany(Bits_history, { as: "bits_histories", foreignKey: "License_type" });
License.belongsTo(License_type, { as: "type_License_type", foreignKey: "type" });
License_type.hasMany(License, { as: "Licenses", foreignKey: "type" });
Bits_history.belongsTo(User, { as: "User", foreignKey: "User_id" });
User.hasMany(Bits_history, { as: "bits_histories", foreignKey: "User_id" });
Refresh_token.belongsTo(User, { as: "User", foreignKey: "User_id" });
User.hasMany(Refresh_token, { as: "Refresh_tokens", foreignKey: "User_id" });
Replenishment_history.belongsTo(User, { as: "User", foreignKey: "User_id" });
User.hasMany(Replenishment_history, { as: "replenishment_histories", foreignKey: "User_id" });
Bit.belongsTo(Image, { as: "image_image", foreignKey: "image" });
Image.hasMany(Bit, { as: "bits", foreignKey: "image" });
Bitmaker.belongsTo(Image, { as: "image_image", foreignKey: "image" });
Image.hasMany(Bitmaker, { as: "bitmakers", foreignKey: "image" });
Box.belongsTo(Image, { as: "image_image", foreignKey: "image" });
Image.hasMany(Box, { as: "boxes", foreignKey: "image" });
User.belongsTo(Image, { as: "image_image", foreignKey: "image" });
Image.hasMany(User, { as: "users", foreignKey: "image" });

module.exports = {
  Bit,
  Bitmaker,
  Bits_history,
  Box,
  Faq,
  License,
  License_bit,
  License_type,
  Refresh_token,
  Replenishment_history,
  Support,
  User,
  Image,
};
