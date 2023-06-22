import { databaseConfig } from './config/dbconfig'
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = databaseConfig;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { host: host, dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('./model/user').default(sequelize);
    db.Order = require('./model/order')(sequelize);
    db.Menu_Item = require('./model/menu_item').default(sequelize);
    db.Restaurant = require('./model/restaurant')(sequelize);


    // associations
    db.User.hasMany(db.Orders);
    db.Order.belongsTo(db.User);

    db.Menu_Item.hasMany(db.Orders);
    db.Order.belongsTo(db.Menu_Item);
    
    db.Restaurant.hasMany(db.User);
    db.User.belongsTo(db.Restaurant,{
        foreignKey: {
            allowNull: true,
        }});
    
    db.Restaurant.hasMany(db.Menu_Item);
    db.Menu_Item.belongsTo(db.Restaurant);

    // sync all models with database {force: true}
    await sequelize.sync({ alter: true });
}