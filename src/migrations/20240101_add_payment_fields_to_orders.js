'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'payment_status', {
      type: Sequelize.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending',
      allowNull: false
    });

    await queryInterface.addColumn('orders', 'payment_method', {
      type: Sequelize.ENUM('card', 'cash'),
      defaultValue: 'cash',
      allowNull: false
    });

    await queryInterface.addColumn('orders', 'payment_intent_id', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'payment_intent_id');
    await queryInterface.removeColumn('orders', 'payment_method');
    await queryInterface.removeColumn('orders', 'payment_status');
    
    // Drop the ENUMs
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_orders_payment_status;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_orders_payment_method;');
  }
};
