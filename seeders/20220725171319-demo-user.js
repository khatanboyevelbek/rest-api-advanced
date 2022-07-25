'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     **/
     await queryInterface.bulkInsert('Users', [{
       email: 'programmerelbek@gmail.com',
       password: '12345',
       firstname: 'Elbek',
       lastname: 'Khatanboyev',
       createdAt: new Date(),
       updatedAt: new Date()
     }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     **/
     await queryInterface.bulkDelete('Users', null, {});
     
  }
};
