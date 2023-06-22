import { DataTypes } from 'sequelize';

export default model;

function model(sequelize) {
    const attributes = {
        user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        telephone: { type: DataTypes.STRING, allowNull: false  },
        status: { type: DataTypes.STRING, defaultValue: "not varified"  },
        role: { type: DataTypes.STRING, defaultValue: "1"  },
        password: { type: DataTypes.STRING, allowNull: false},
        refress_token: { type: DataTypes.STRING}
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['password'] }
        },
        scopes: {
            // include hash with this scope
            withPassword: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}