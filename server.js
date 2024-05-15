const express = require ('express');
const socketio = require('socket.io'); //declared again below as io
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

/*process.on('uncaughtException', function (err) {
	console.error(err);
	console.log("Node NOT Exiting...");
  });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});*/

const poolConfig = {
	max: 5,
	min: 2,
	idleTimeoutMillis: 600000,
};

const db_database = process.env.PG_DATABASE;
const db_username = process.env.PG_USER;
const db_password = process.env.PG_PASSWORD;
const db_host = process.env.PG_HOST;
const db_port = process.env.PG_PORT;

poolConfig.connectionString = `postgress://${db_username}:${db_password}@${db_host}:${db_port}/${db_database}`;

const client = new Pool(poolConfig);

//SETUP++++++
var app = express();
app.use(express.json());//added from https://sodiqfarhan.hashnode.dev/building-a-nodejs-app-with-postgres-database-on-render-a-step-by-step-guide-beginner-friendly#heading-connecting-the-nodejs-api-with-the-database
var server = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
} );

app.use('/login.css', express.static(__dirname + '/login.css'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/assets', express.static(__dirname + '/assets'));

var port = process.env.PORT || 5000;

server.listen(port);
console.log("Server Running!");
var io = require('socket.io') (server, {});

var SOCKET_LIST = {};

io.sockets.on('connection', function(socket){//SOCKETS++++++
	SOCKET_LIST[socket.id] = socket;
	var newID;
	newId();

	socket.on("client", function(){
		console.log("client loaded.")
	});

	//check credentials for user login + send user information to client
	socket.on('attemptLogin', function(data){
		var email = data.email.trim();
		var password = data.pass;
		var stayLoggedIn = false; //replace with data.stayLoggedIn

		client.query('SELECT password FROM users WHERE email = $1;', [email])
			.then(results => {
				if(results.rows[0] != null && validateHash(password, results.rows[0].password)){
					return client.query('SELECT * FROM users WHERE email = $1', [email])
					.then((results) =>{
						var dbInfo = JSON.stringify(results.rows[0]);
						var user = JSON.parse(dbInfo);
						var userInfo;

						var uname = user.username;
						var information = user.information;

						userInfo = [uname, stayLoggedIn, information];//replace * FROM users w only necessary information
						
						socket.emit('userInfo', userInfo);
					})
				}
				else{
					var msg = "Λανθασμένος συνδυασμός email και κωδικού χρήστη!"
					socket.emit('showMessage', msg);
				}
			})
	});

	//check credentials for SIGN UP
	function checkCredentials(data){
		var username = data.username.trim();
		var email = data.email.trim();
		var pass = data.pass;
		
		//hash password given by user
		password = hashPass(pass);
		
		client.query('SELECT email FROM users WHERE email = $1', [email])
			.then(results => { //check if email already exists
				if(results.rows[0] != null && results.rows[0].email == email){
					var data = "Υπάρχει ήδη λογαριασμός με το συγκεκριμένο email.";
					socket.emit('show_error', data);
					return false;
				}
			})
			.then( () => { //if email doesnt already exist continue with account creation
				client.query('INSERT INTO users(id, email, password, username, accStatus, subscriptionDate) VALUES($1, $2, $3, $4, $5, $6)', [newID, email, password, username, 'free', '31.12.2023'])
			})
	}

	//create new account ID
	function newId(){
		client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1')
			  .then(results => {
					newID = results.rows[0].id +1;
			  })
			  
	}

	//hash password given by user
	function hashPass(originalPass){
		const saltRounds = 10;

		const hashedPass = bcrypt.hashSync(originalPass, saltRounds);

		return hashedPass;
	}

	//compare and validate password given by user to hashed version
	function validateHash(pass, hashed){
		const match = bcrypt.compareSync(pass, hashed);

		return match;
	}
});