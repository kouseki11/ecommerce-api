const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

   return queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name: "Admin E-commerce",
      username: "Admin E",
      email: "admine@gmail.com",
      phone_number: "555-123-4567",
      role: 'admin',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
   }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
