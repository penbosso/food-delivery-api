const { DataTypes } = require('sequelize');
require('dotenv').config();

module.exports = model;

function model(sequelize) {
    const attributes = {
        restaurant_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        restaurant_name: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, defaultValue: "opened"  },
        location: { type: DataTypes.STRING },
        image_url: { type: DataTypes.STRING, defaultValue: process.env.RESTAURANT_IMAGE_PLACEHOLDER }
    };


    return sequelize.define('Restaurant', attributes);
}