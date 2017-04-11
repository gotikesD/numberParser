const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const user = require('./mock/index')

app.get('/', detectToken, detectTokenExp, function (req, res) {
    res.send(JSON.stringify(user));
});

app.get('/login', detectToken, function (req, res, next) {
    res.end('Login success')
});

app.use(function (err, req, res, next) {
    res.end(err)
});

app.listen('8080');


function detectToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (token) {
        console.log('TOKEN DETECTED');
        next()
    } else {
        const newToken = jwt.sign({
            expireDate: Date.now() + 10000,
            data: {id: user.id}
        }, 'secret');
        console.log('TOKEN NOT FOUND.NEW TOKEN SET');
        res.set('x-access-token', newToken);
        next()
    }

}

function detectTokenExp(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, 'secret', function (err, decoded) {
        if (err) {
            next('Need to login')
        } else {
            if (decoded.expireDate < Date.now()) {
                const newToken = jwt.sign({
                    expireDate: Date.now() + 10000,
                    data: {id: user.id}
                }, 'secret');
                console.log('TOKEN EXPIRED, NEW TOKEN SET');
                res.set('x-access-token', newToken);
                next()
            } else {
                console.log('CORRECT TOKEN');
                next()
            }
        }
    });
}



