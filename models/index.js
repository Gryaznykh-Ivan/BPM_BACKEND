const sequelize = require('../db')
const DataTypes = require("sequelize").DataTypes;
const bit = require("./bit")(sequelize, DataTypes);
const bitmaker = require("./bitmaker")(sequelize, DataTypes);
const bits_history = require("./bits_history")(sequelize, DataTypes);
const box = require("./box")(sequelize, DataTypes);
const faq = require("./faq")(sequelize, DataTypes);
const license = require("./license")(sequelize, DataTypes);
const license_bit = require("./license_bit")(sequelize, DataTypes);
const license_type = require("./license_type")(sequelize, DataTypes);
const refresh_token = require("./refresh_token")(sequelize, DataTypes);
const replenishment_history = require("./replenishment_history")(sequelize, DataTypes);
const user = require("./user")(sequelize, DataTypes);

bit.belongsToMany(license, { as: 'license_id_licenses', through: license_bit, foreignKey: "bit_id", otherKey: "license_id" });
license.belongsToMany(bit, { as: 'bit_id_bits', through: license_bit, foreignKey: "license_id", otherKey: "bit_id" });
bits_history.belongsTo(bit, { as: "bit", foreignKey: "bit_id" });
bit.hasMany(bits_history, { as: "bits_histories", foreignKey: "bit_id" });
license_bit.belongsTo(bit, { as: "bit", foreignKey: "bit_id" });
bit.hasMany(license_bit, { as: "license_bits", foreignKey: "bit_id" });
bit.belongsTo(bitmaker, { as: "author_bitmaker", foreignKey: "author" });
bitmaker.hasMany(bit, { as: "bits", foreignKey: "author" });
license.belongsTo(box, { as: "case", foreignKey: "case_id" });
box.hasMany(license, { as: "licenses", foreignKey: "case_id" });
license_bit.belongsTo(license, { as: "license", foreignKey: "license_id" });
license.hasMany(license_bit, { as: "license_bits", foreignKey: "license_id" });
bits_history.belongsTo(license_type, { as: "license_type_license_type", foreignKey: "license_type" });
license_type.hasMany(bits_history, { as: "bits_histories", foreignKey: "license_type" });
license.belongsTo(license_type, { as: "type_license_type", foreignKey: "type" });
license_type.hasMany(license, { as: "licenses", foreignKey: "type" });
bits_history.belongsTo(user, { as: "user", foreignKey: "user_id" });
user.hasMany(bits_history, { as: "bits_histories", foreignKey: "user_id" });
refresh_token.belongsTo(user, { as: "user", foreignKey: "user_id" });
user.hasMany(refresh_token, { as: "refresh_tokens", foreignKey: "user_id" });
replenishment_history.belongsTo(user, { as: "user", foreignKey: "user_id" });
user.hasMany(replenishment_history, { as: "replenishment_histories", foreignKey: "user_id" });

module.exports = {
  bit,
  bitmaker,
  bits_history,
  box,
  faq,
  license,
  license_bit,
  license_type,
  refresh_token,
  replenishment_history,
  user,
};
