process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const ROLES_LIST = require('../config/roles_list');

chai.use(chaiHttp);
const expect = chai.expect;

describe('API endpoints together', () => {
    let token;
    let userId; // 13

    describe('POST /users/register', () => {
        it('should create a new user', (done) => {
            chai
                .request(app)
                .post('/users/register')
                .send({
                    first_name: 'Chris',
                    last_name: 'Boss',
                    telephone: '2234560239',
                    status: 'active',
                    role: ROLES_LIST.Admin,
                    password: 'password123'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('user_id');
                    expect(res.body.first_name).to.equal('Chris');
                    expect(res.body.last_name).to.equal('Boss');
                    expect(res.body.telephone).to.equal('2234560239');
                    expect(res.body.status).to.equal('active');
                    expect(res.body.role).to.equal(ROLES_LIST.Admin);
                    userId = res.body.user_id; // Store the created user ID for future tests              console.log('******', userId)
                    done();
                });
        });
    });


    describe('POST /users/authenticate', () => {
        it('should authentiate user', (done) => {
            chai
                .request(app)
                .post('/users/authenticate')
                .send({
                    telephone: '2234560239',
                    password: 'password123'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('user_id');
                    expect(res.body).to.have.property('token');
                    token = res.body.token; // Store the auth user token for future tests
                    done();
                });
        });
    });

    describe('GET /users/:id', () => {
        it('should retrieve a specific user', (done) => {
            chai
                .request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.user_id).to.equal(userId);
                    expect(res.body.first_name).to.equal('Chris');
                    expect(res.body.last_name).to.equal('Boss');
                    expect(res.body.telephone).to.equal('2234560239');
                    expect(res.body.status).to.equal('active');
                    done();
                });
        });
    });

    describe('PUT /users/:id', () => {
        it('should update a specific user', (done) => {
            chai
                .request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    first_name: 'Jane',
                    last_name: 'Bosso',
                    telephone: '9876543263',
                    status: 'inactive',
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.user_id).to.equal(userId);
                    expect(res.body.first_name).to.equal('Jane');
                    expect(res.body.last_name).to.equal('Bosso');
                    expect(res.body.telephone).to.equal('9876543263')
                    expect(res.body.status).to.equal('inactive');
                    done();
                });
        });
    });

    let restaurantId;

    describe('POST /restaurants', () => {
        it('should create a new restaurant', (done) => {
            chai
                .request(app)
                .post('/restaurants')
                .send({
                    restaurant_name: 'Example Restaurant',
                    image_url: 'https://example.com/restaurant.jpg',
                    status: 'open'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('restaurant_id');
                    restaurantId = res.body.restaurant_id; // Store the created restaurant ID for future tests
                    done();
                });
        });
    });

    describe('GET /restaurants/:id', () => {
        it('should retrieve a specific restaurant', (done) => {
            chai
                .request(app)
                .get(`/restaurants/${restaurantId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('restaurant_id', restaurantId);
                    expect(res.body).to.have.property('restaurant_name', 'Example Restaurant');
                    done();
                });
        });
    });

    describe('PUT /restaurants/:id', () => {
        it('should update a specific restaurant', (done) => {
            chai
                .request(app)
                .put(`/restaurants/${restaurantId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    restaurant_name: 'Updated Restaurant',
                    image_url: 'https://example.com/updated-restaurant.jpg',
                    status: 'closed'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('restaurant_id', restaurantId);
                    expect(res.body).to.have.property('restaurant_name', 'Updated Restaurant');
                    expect(res.body).to.have.property('status', 'closed');
                    done();
                });
        });
    });

    let menuItemId; // To store the ID of the created menu item for later use

    it('should create a new menu item', (done) => {
        chai
            .request(app)
            .post('/menu-items')
            .send({
                menu_item_name: 'Burger',
                status: 'available',
                description: 'Delicious burger',
                image_url: 'https://example.com/burger.jpg',
                restaurant_id: restaurantId,
                cost: 9.99
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('menu_item_id');
                menuItemId = res.body.menu_item_id; // Store the created menu item ID for later use
                done();
            });
    });

    it('should get a specific menu item', (done) => {
        chai
            .request(app)
            .get(`/menu-items/${menuItemId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('menu_item_name').that.equals('Burger');
                done();
            });
    });

    it('should update a menu item', (done) => {
        chai
            .request(app)
            .put(`/menu-items/${menuItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                menu_item_name: 'Cheeseburger',
                status: 'unavailable'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('menu_item_name').that.equals('Cheeseburger');
                expect(res.body).to.have.property('status').that.equals('unavailable');
                done();
            });
    });
    let orderId; // To store the ID of the created order for later use

    it('should create a new order', (done) => {
        chai
            .request(app)
            .post('/orders')
            .send({
                menu_item_id: menuItemId,
                status: 'pending',
                restaurant_id: restaurantId,
                quantity: 2
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('order_id');
                orderId = res.body.order_id; // Store the created order ID for later use
                done();
            });
    });

    it('should get a specific order', (done) => {
        chai
            .request(app)
            .get(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status').that.equals('pending');
                done();
            });
    });

    it('should update an order', (done) => {
        chai
            .request(app)
            .put(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'completed'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status').that.equals('completed');
                done();
            });
    });

    // deleteing

    it('should delete an order', (done) => {
        chai
            .request(app)
            .delete(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').that.equals('Order deleted successfully');
                done();
            });
    });

    it('should delete a menu item', (done) => {
        chai
            .request(app)
            .delete(`/menu-items/${menuItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').that.equals('Menu item deleted successfully');
                done();
            });
    });

    describe('DELETE /restaurants/:id', () => {
        it('should delete a specific restaurant', (done) => {
            chai
                .request(app)
                .delete(`/restaurants/${restaurantId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(204);
                    done();
                });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a specific user', (done) => {
            chai
                .request(app)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(204);
                    done();
                });
        });
    });
});
