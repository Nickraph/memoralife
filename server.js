const express = require ('express');
const socketio = require('socket.io'); //declared again below as io
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
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

/* old code:
const poolConfig = {
	max: 5,
	min: 2,
	idleTimeoutMillis: 600000,
};*/
const poolConfig = {
    max: 5,
    min: 2,
    idleTimeoutMillis: 60000,
    connectionString: `postgresql://mluser:rncy2mDN8PuPxfYGKrWoRA55NzIH4D8B@dpg-cr0hqoi3esus73ainrl0-a.frankfurt-postgres.render.com/mldb_l4pp`,
    ssl: {
        rejectUnauthorized: false
    }
};

const db_database = process.env.PG_DATABASE;
const db_username = process.env.PG_USER;
const db_password = process.env.PG_PASSWORD;
const db_host = process.env.PG_HOST;
const db_port = process.env.PG_PORT;

//poolConfig.connectionString = `postgress://${db_username}:${db_password}@${db_host}:${db_port}/${db_database}`;
//old: poolConfig.connectionString = `postgres://dbuser:sDZxRE4o4UynIoEcRXPkFgndPQUiizK0@dpg-cnr39ta1hbls73dtr580-a.frankfurt-postgres.render.com/mldb_ef58`;
//from before adding same info in poolConfig: poolConfig.connectionString = `postgresql://mluser:rncy2mDN8PuPxfYGKrWoRA55NzIH4D8B@dpg-cr0hqoi3esus73ainrl0-a.frankfurt-postgres.render.com/mldb_l4pp`;

const client = new Pool(poolConfig);

//SETUP++++++
var app = express();
//app.use(express.json());//added from https://sodiqfarhan.hashnode.dev/building-a-nodejs-app-with-postgres-database-on-render-a-step-by-step-guide-beginner-friendly#heading-connecting-the-nodejs-api-with-the-database
var server = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
} );
app.get('/profile', function(req, res) {
	res.sendFile(__dirname + '/profile.html')
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
	//var newID;
	//newId();
	var informationColumns = [
		"name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine"
	];

	socket.on("client", function(){
		console.log("client loaded.")
	});

	//check credentials for user login + send user information to client
	socket.on('attemptLogin', function(data){
		var email = data.email;
		var password = data.password;
		var stayLoggedIn = false; //replace with data.stayLoggedIn
		var response = "-";

		client.query('SELECT password FROM credentials WHERE email = $1;', [email])
			.then(results => {
				if(results.rows[0] != null && validateHash(password, results.rows[0].password)){
					return client.query('SELECT c.accstatus, c.infocompletion, i.* FROM credentials c RIGHT JOIN information i ON c.id = i.id WHERE c.email = $1', [email])
					.then((results) =>{
						var dbResults = results.rows[0];//data string format
						var userInfo; //array of data that will be sent to client in addition to dbData
						
						// Check if dbResults is null or undefined
                        if (dbResults != null) {
                            // Parse only if dbResults is not null
                            var dbData = JSON.parse(JSON.stringify(dbResults)); // data JSON format

                            if (dbData.accstatus == "active") {
                                response = "logged";
                                userInfo = {stayLoggedIn, response, dbData};
                            } else if (dbData.accstatus == "inactive") {
                                response = "not logged";
                                userInfo = {stayLoggedIn, response};
                            }
                        } else {
                            // Handle null result here
                            response = "no user data found";
                            userInfo = {stayLoggedIn, response};
                        }
						socket.emit('confirmLogin', userInfo);//send the information package to client
					})
				}
				else{
					var msg = "Λανθασμένος συνδυασμός email και κωδικού χρήστη!"
					socket.emit('showMessage', msg);
				}
			})
			.catch(err => {
				console.error('Database query error:', err);
				socket.emit('showMessage', 'An error occurred');
			})
	});

	//check credentials for SIGN UP
	socket.on('attemptSignup', function(data){
		var email = data.email.trim();
		var pass = data.password;
		var firstname = data.firstname;
		var lastname = data.lastname;
		
		//hash password given by user
		var password = hashPass(pass);
		
		client.query('SELECT email FROM credentials WHERE email = $1', [email])//check if email already exists
			.then(results => { 
				if(results.rows[0] != null && results.rows[0].email == email){
					var response = "Υπάρχει ήδη λογαριασμός με το συγκεκριμένο email.";
					socket.emit('show_error', response);
					return false;
				}
			})
			.then( () => { //if email doesnt already exist continue with account creation
				client.query('INSERT INTO credentials(email, password, accstatus, visibility, accountid, infocompletion) VALUES($1, $2, $3, $4, $5, $6)', [email, password, 'active', 'private', '@admin', 0]);
				client.query(`INSERT INTO information(name, surname, dob, pob, nickname, generalinfo, address, familynames, familyoccupations, pets, childhoodinfo, address_childhood, school_childhood, lovememories, memories_childhood_misc, media_childhood, studies, occupations, marriage, partnerinfo, kids, memories_adulthood_misc, grandchildren, media_seniority, values, achievements, fav_foods, fav_scents, fav_fun, fav_seasons, fav_media, fav_memories, fav_music, fav_hobbies, fav_misc, leastfav, routine, media_misc) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
`, [firstname, lastname, "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38"]);
				//Database entry created. Inform client:
				socket.emit("showMessage", "Account Created!")
			})
			.catch(err => {
				console.error('Database query error:', err);
				socket.emit('showMessage', 'An error occurred');
			})
	});

	socket.on("updateUserInfo", function(data){//called when user updates/edits profile info (later add email+pass editing)
		for(i in informationColumns){
			if(data.informationColumns[i] != ""){//maybe make it into a string then send query
				client.query('INSERT INTO information('+informationColumns[i]+') VALUES($1)', [data.informationColumns[i]]);
			}
		}
	});

	/*/create new account ID
	function newId(){
		client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1')
			  .then(results => {
					newID = results.rows[0].id +1;
			  })
			  
	}*/

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