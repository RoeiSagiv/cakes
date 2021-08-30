process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../api/server');

chai.use(chaiHttp);

describe('Server routes test', () => {
    it("Test if get all products stored in products.js", (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Array');
                done();
            });
    });


    chai.should()
    it("Test if get all cart products from products", (done) => {
        chai.request(app)
            .post('/api/products')
            .send({cart: [1]})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Array');
                done();
            });
    });

    it("Test if get all users who signup", (done) => {
        chai.request(app)
            .get('/db/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Array');
                done();
            });
    });

    it("Test if not log in", (done) => {
        chai.request(app)
            .post('/api/auth')
            .send({
                username: 'irrelevant',
                password: 'irrelevant'
            })
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });

    });

    chai.should();
    describe("Test of sign up", () => {

        let registerDetails = {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'firstName@gmail.com',
            username: 'user1',
            password: '123456',
            address: 'Israel',
            role: 'User'
        };

        before("Test if sign in succeed the user - add to database", (done) => {
            chai.request(app)
                .post('/api/signup')
                .send(registerDetails)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    chai.should();
    describe("Test of logout", () => {

        it("Test if clear cookie", (done) => {
            chai.request(app)
                .get('/api/logout')
                .then(function (res) {
                    expect(res).not.to.have.cookie('token');
                    res.should.have.status(200);
                    done();
                });
        });
    });
});