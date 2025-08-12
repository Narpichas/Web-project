const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'project_alpha_db',
  process.env.DB_USER || 'project_alpha_user',
  process.env.DB_PASSWORD || 'ProjectPass123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: true
    }
  }
);

module.exports = { sequelize }; 
