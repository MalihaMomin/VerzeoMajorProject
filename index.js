const mysql = require("mysql2");
var path = require("path");
const express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql@password.2",
    database: "online_vidya"
});

conn.connect((err) => {
    if (!err) 
        console.log("Database connected successfully!");
    else
        console.log("Database connection failed \n Error: " + JSON.stringify(err, undefined, 2));
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/submit', (req,res) => {
    var sno=req.body.sno;
    var name=req.body.name;
    var phone=req.body.phone;
    var email=req.body.email;
    var course=req.body.course;
    conn.connect((err) => {
        if (err) throw err;
        var sql = "INSERT INTO students (sno, name, phone, email, course) VALUES ('"+sno+"', '"+name+"', '"+phone+"', '"+email+"','"+course+"')";
        conn.query(sql, (err, result) => {
            if (err) throw err;
            console.log("1 record inserted");
            res.end();
        });
    });
    res.sendFile(__dirname + "/navigate.html");
});

function executeQuery(options, cb) {
    if(!options || !options.sql)
      throw (new Error('Invalid sql statement')); 
    conn.query(options.sql, (err, result, fields) => {
        if (err) throw err;
        cb(result);
    });
}

app.get("/students", (req, res) => {
    var options = {
        sql : 'SELECT * FROM students'
    }
    executeQuery(options, (result) => {
        res.write("<body style='background-color: grey; color:black;'>")
        res.write("<h1 style='text-align:center; font-size: 2.6em;'>"+"Student's Records"+"</h1>");
        res.write("<table style='margin-left:auto; margin-right:auto; border: 2px solid black; border-collapse: collapse;'>");
        res.write("<tr>");
        for(var column in result[0]){
            res.write("<th style='font-weight: bold; border: 2px solid black; border-collapse: collapse; padding: 15px; text-align: center;'><label>" + column.toUpperCase() + "</label></th>");
        }
        res.write("</tr>");
        for(var row in result){
            res.write("<tr>");
            for(var column in result[row]){
                res.write("<td style='font-weight: 500; border: 2px solid black; border-collapse: collapse; padding: 15px; text-align: center;'><label>" + result[row][column] + "</label></td>");       
            }
            res.write("</tr>");         
        }
        res.write("</table>");
        res.write("<br>");
        res.write("<p style='text-align:center; font-size: x-large;'><a href='http://localhost:7000' target='_blank' style='color: rgb(59, 9, 9); font-weight: bold;'>"+"Click to Add New Record"+"</a></p>");
        res.write("</body>")
    });
});

app.listen(7000, () => console.log("Server Started..."));
