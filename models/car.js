"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      Car.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
      Car.belongsTo(models.User, { foreignKey: "updatedBy", as: "updater" });
      Car.belongsTo(models.User, { foreignKey: "deletedBy", as: "deleter" });
    }
  }

  Car.init(
    {
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      deletedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Car",
      paranoid: true,
      deletedAt: "deletedAt",
    }
  );

  return Car;
};
