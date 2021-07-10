const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { authenticateToken, generateAccessToken } = require('./services/token');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let loggedUsrObj;

dotenv.config();
const PORT = process.env.PORT | 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/api/user/create', function (request, response) {
    let dbo; let inputs = {
        fullName: request.body.fullName, email: request.body.email, password: request.body.password
    };
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err1, db) {
        if (err1) { throw err; }
        dbo = db.db("coursedb");
        dbo.collection("tbl_users").findOne({ email: inputs.email }, function (err, result) {
            if (err) { throw err; }
            if (result) {
                db.close();
                response.json({ 'status': 'failure', 'message': 'Duplicate user' });
            }
            dbo.collection("tbl_users").insertOne(inputs, function (err, res) {
                if (err) { throw err; }
                db.close();
                response.json({ 'status': 'success', 'message': 'User created successfully' });
            });
        });
    });
});

app.post('/api/user/login', function (request, response) {
    let dbo; let inputs = { 'email': request.body.email, 'password': request.body.password }; let userToken, outputObj;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err1, db) {
        if (err1) { throw err1; }
        dbo = db.db("coursedb");
        dbo.collection("tbl_users").findOne({ email: inputs.email, password: inputs.password }, function (err, result) {
            if (err) throw err;
            if (!result) {
                db.close();
                response.json({ 'status': 'failure', 'message': 'Invalid credentials' });
            }
            userToken = generateAccessToken({ 'username': inputs.email });
            outputObj = {
                status: 'success', message: 'User logged in successfully', token: userToken,
                fullName: result.fullName, email: result.fullName
            };
            loggedUsrObj = result;
            response.json(outputObj);
        });
    });
});

app.get('/api/course/list', authenticateToken, function (request, response) {
    let dbo;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err1, db) {
        if (err1) throw err1;
        dbo = db.db("coursedb");
        dbo.collection("tbl_courses").find({}).toArray(function (err, result) {
            if (err) throw err;
            outputObj = { status: 'success', records: result };
            response.json(outputObj);
        });
    });
});

app.listen(PORT);



