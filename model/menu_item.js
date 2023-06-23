const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        menu_item_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        menu_item_name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING,  defaultValue: "available"  },
        cost: { type: DataTypes.DECIMAL, allowNull: false },
        image_url: { type: DataTypes.STRING}
    };


    return sequelize.define('Menu_item', attributes);
}