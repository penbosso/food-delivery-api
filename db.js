const databaseConfig = require('./config/dbconfig');
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
    db.User = require('./model/user')(sequelize);
    db.Order = require('./model/order')(sequelize);
    db.Menu_item = require('./model/menu_item')(sequelize);
    db.Restaurant = require('./model/restaurant')(sequelize);


    // associations
    db.User.hasMany(db.Order);
    db.Order.belongsTo(db.User, {  foreignKey: { name: 'user_id' } });

    db.Menu_item.hasMany(db.Order);
    db.Order.belongsTo(db.Menu_item, {  foreignKey: { name: 'menu_item_id' } });
    
    db.Restaurant.hasMany(db.User);
    db.User.belongsTo(db.Restaurant, {  foreignKey: { name: 'restaurant_id' } });
    
    db.Restaurant.hasMany(db.Order);
    db.Order.belongsTo(db.Restaurant, {  foreignKey: { name: 'restaurant_id' } });

    db.Restaurant.hasMany(db.Menu_item);
    db.Menu_item.belongsTo(db.Restaurant, {  foreignKey: { name: 'restaurant_id' } });

    // sync all models with database {force: true}
    await sequelize.sync({ alter: true });
}