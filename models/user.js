"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Auth, { foreignKey: "userId", as: "auth" });
      User.hasMany(models.Car, { foreignKey: "createdBy", as: "createdCars" });
      User.hasMany(models.Car, { foreignKey: "updatedBy", as: "updatedCars" });
      User.hasMany(models.Car, { foreignKey: "deletedBy", as: "deletedCars" });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 100],
        },
      },
      age: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      address: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM("admin", "superadmin", "member"),
        allowNull: false,
        defaultValue: "member",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
