var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mysql = require('mysql');

// create database connection
var connection =  mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '1234',
    database: 'users-db'
});
connection.connect(function(err) {
    if (!err)  {
        console.log("Database is connected...");
    } else {
        console.log("Error connecting database...")
    }
});

var app = express();
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;

app.use(express.static(path.join(__dirname, '/static')));

var router = express.Router();
router.use(function(req, res, next) {
    // do logging
    console.log('Server running ' + req.url);
    next(); // make sure we go to the next routes and don't stop here
});

// get all users (accessed at GET http://localhost:8080/users)
router.get('/', function(req, res) {
    connection.query(
      "SELECT * from users",
      (err, rows, fields) => {
        if (!err)  {
            res.json(rows);
        } else {
            console.log("get all users failed...");
            res.send("Failed get users...");
        }
      }
    );
});

// create user (accessed at POST http://localhost:8080/users)
router.post('/', function(req, res) {
    console.log("new user :");
    console.log(req.body);
    var sql = "INSERT INTO users SET ?";
    connection.query(sql, req.body, (err, result) => {
        if (!err) {
            console.log("Successed adding new user, id " + result.insertId);
            res.send("Add new user success...");
        } else {
            console.log(err);
            res.status(400).send("Failed adding new user...");
        }
    });
});

// get user by id (accessed at GET http://localhost:8080/users/:user_id)
router.get('/:user_id', function(req, res) {
    var sql = "SELECT * FROM users WHERE id = ?";
    connection.query(sql, [req.params.user_id], (err, rows, fields) => {
        if (err) {
            console.log("Get user by id failed...");
            res.status(400).send("User not found");
        }
        else  {
            // database return objects array
            if (!rows.length) {
                res.status(400).send("User not found");
            } else {
                res.json(rows[0]);
            }
        }
    });
});

// update user by id (accessed at PUT http://localhost:8080/users/:user_id)
router.put('/:user_id', function(req, res) {
    var sql = "UPDATE users SET ? Where id = ?";
    connection.query(sql, [req.body, req.params.user_id], (err, result) => {
        if (err)  {
            console.log(err);
            res.status(400).send(err);
        } else {
            console.log(result);
            res.send("Updating user success...");
        }
    });
});

// delete user by id (accessed at DELETE http://localhost:8080/users/:user_id)
router.delete('/:user_id', function(req, res) {
    var sql = "DELETE FROM users WHERE id = ?";
    connection.query(sql, [req.params.user_id], (err, result) => {
        if (err)  {
            console.log(err);
            res.status(400).send(err);
        } else {
            //console.log(result);
            if (!result.affectedRows) {
                //console.log("nothing deleted");
                res.status(400).send("User not found");
            } else {
                //console.log("deleted...");
                res.send("Delete user success...");
            }
        }
    });
});

app.use('/users', router);

app.listen(port, function() {
    console.log('Express App started');
});