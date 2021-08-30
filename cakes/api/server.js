'use strict';

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cookierParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(cors());
app.use(cookierParser());
app.use('/', express.static('../src'));

const db = new sqlite3.Database('users.db', (err, row) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});
const sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT,
 username TEXT, password NUMERIC, role TEXT, email TEXT, address TEXT)`;

db.serialize(() => {
    db.run(sql, [], (err) => {
        if (err) {
            console.log('Error running sql ' + sql)
            console.log(err)
        } else {
            console.log('db is running')
        }
    });

});


app.get('/db/users', (req, res) => {

    let sql2 = `SELECT * FROM users`
    db.all(sql2, (err, rows) => {
        return res.status(200).send(rows);
    });
});

app.get('/api/products', (req, res) => {
    return res.status(200).json(data.products);
});

const userLogged = function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(201).send("no token")
    } else {
        next();
    }
}

app.get('/checkToken', userLogged, function (req, res) {
    res.sendStatus(200);
});

app.post('/api/products', (req, res) => {
    let products = [], id = null;
    let cart = JSON.parse(req.body.cart);
    if (!cart)
        return res.status(200).json(products);

    for (let i = 0; i < data.products.length; i++) {
        id = data.products[i].id.toString();
        if (cart.hasOwnProperty(id)) {
            data.products[i].qty = cart[id]
            products.push(data.products[i]);
        }
    }
    return res.status(200).json(products);
});

app.post('/api/auth', (req, res) => {


    let sqlauth = `SELECT * FROM users WHERE password = ? AND username = ?`;

    db.all(sqlauth, [req.body.password, req.body.username], function (err, rows) {
        let user = '';

        if (err) {
            console.log('Error running the sql ' + sql);
            console.log(err)
        } else {
            rows.forEach((row) => {
                user = {
                    firstName: row.firstName,
                    lastName: row.lastName,
                    username: row.username,
                    role: row.rol, //can be deleted?
                    email: row.email,
                    address: row.address
                }
            });
        }

        if (rows.length) {
            let rememberMeTime;
            if (req.body.rememberMe) rememberMeTime = 1000000 * 1000000 * 1000
            else rememberMeTime = 1000 * 60 * 5 // Expiration after 5 minute.

            const cookieConfig = {
                maxAge: rememberMeTime
            };
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

            let token_payload = {
                username: req.body.username,
                password: req.body.password
            };
            let token = jwt.sign(token_payload, "jwt_secret_password", {expiresIn: '2h'});
            res.cookie('token', token, cookieConfig)

            return res.status(200).send(user)
        } else {
            return res.status(409).json({errorMessage: 'Username or password is incorrect, please try agian.'})
        }
    })
});

app.post('/api/signup', (req, res) => {

    let sql = `SELECT * FROM users WHERE username = ?`;

    db.all(sql, [req.body.username], function (err, rows) {
        if (!err && !rows.length) {
            db.run(`INSERT INTO users (firstName, lastName, username, password, role, email, address)
    
        VALUES (?, ?, ?, ?, ?, ?, ?)`, [req.body.firstName, req.body.lastName, req.body.username, req.body.password,
                'User', req.body.email, req.body.address], function (err) {
                    if (err) {
                        res.status("409").json("Sign Up failed.. please try agian.");
                    }
                }
            );
            // create a token using user_name and password valid for 2 hours.
            let token_payload = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password
            };
            let token = jwt.sign(token_payload, "jwt_secret_password", {expiresIn: '2h'});
            let response = {message: 'Token Created, Authentication Successful!', token: token, isUnique: true};
            return res.status(200).json(response);
        } else {
            let response = {message: 'Username is already exists! please try agian.', isUnique: false};
            return res.status(201).json(response);
        }
    });

});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));

module.exports = app;