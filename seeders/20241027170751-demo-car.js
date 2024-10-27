"use strict";
const faker = require("faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const cars = [];

    for (let i = 0; i < 10; i++) {
      cars.push({
        brand: faker.vehicle.manufacturer(), // Generates a random car brand
        model: faker.vehicle.model(), // Generates a random car model
        year: faker.date.past(5).getFullYear(), // Generates a random year within the past 5 years
        createdBy: 1, // Assuming user ID 1 exists
        updatedBy: null,
        deletedBy: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Cars", cars, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Cars", null, {});
  },
};
