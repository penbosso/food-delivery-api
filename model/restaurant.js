const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        restaurant_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        restaurant_name: { type: DataTypes.STRING, allowNull: false },
        image_url: { type: DataTypes.STRING, defaultValue: "pending" }
    };


    return sequelize.define('Restaurant', attributes);
}