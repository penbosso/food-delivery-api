import { DataTypes } from 'sequelize';

export default model;

function model(sequelize) {
    const attributes = {
        order_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.STRING, defaultValue: "pending"  }
    };


    return sequelize.define('Restaurant', attributes, options);
}