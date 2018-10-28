const mysql = require('mysql');
const express = require('express');
var app = express();
const bodypareser = require('body-parser');
const cors = require('cors');

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodypareser.json());
app.use(cors(corsOptions));


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'edusup'
});


mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection succeeded');
    } else {
        console.log('DB connection failed  ' + JSON.stringify(err, undefined, 2));
    }

});


app.get('/api/', (req, res)=>{
   res.status(200).json({
       message: 'success'
   });
});

app.post('/api/user/login', (req,res)=>{

    where = 'username = ? and password = ?';
    values = [req.body.username, req.body.password];
    sql = 'SELECT * FROM users where '+ where;

    mysqlConnection.query(sql, values, (err, rows)=> {
        if(!err){
            if(rows.length === 1){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({success: true}));
            }else{
                res.send(JSON.stringify({success: false}));
            }
        }else{
            console.log(err);
            res.send(err);
        }
    })
});

app.listen(3000,()=>console.log('server listening to 3000'));