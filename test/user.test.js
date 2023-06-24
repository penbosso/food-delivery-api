process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const ROLES_LIST = require('../config/roles_list');

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {
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
                    telephone: '1234567899',
                    status: 'active',
                    role: ROLES_LIST.User,
                    password: 'password123'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('user_id');
                    expect(res.body.first_name).to.equal('Chris');
                    expect(res.body.last_name).to.equal('Boss');
                    expect(res.body.telephone).to.equal('1234567899');
                    expect(res.body.status).to.equal('active');
                    expect(res.body.role).to.equal(ROLES_LIST.User);
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
                    telephone: '1234567899',
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
                    expect(res.body.telephone).to.equal('1234567899');
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
                    telephone: '9876543210',
                    status: 'inactive',
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.user_id).to.equal(userId);
                    expect(res.body.first_name).to.equal('Jane');
                    expect(res.body.last_name).to.equal('Bosso');
                    expect(res.body.telephone).to.equal('9876543210')
                    expect(res.body.status).to.equal('inactive');
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
