const express = require ('express');
//socket.io declared below as io
const multer = require('multer');
const admin = require('firebase-admin'); // Firebase Admin SDK (Backend Authentication)
const cloudinary = require('cloudinary').v2; // cloudinary
const cors = require('cors');
const fs = require('fs');
const util = require('util');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

const poolConfig = {
    max: 5,
    min: 2,
    idleTimeoutMillis: 60000,
    connectionString: `postgresql://mluser:rncy2mDN8PuPxfYGKrWoRA55NzIH4D8B@dpg-cr0hqoi3esus73ainrl0-a.frankfurt-postgres.render.com/mldb_l4pp`,
    ssl: {
        rejectUnauthorized: false
    }
};

const client = new Pool(poolConfig);

//SETUP++++++
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
} );
app.get('/profile', function(req, res) {
	res.sendFile(__dirname + '/profile.html')
} );
app.get('/profileview', function(req, res) {
	res.sendFile(__dirname + '/profileview.html')
} );


app.use('/login.css', express.static(__dirname + '/login.css'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/assets', express.static(__dirname + '/assets'));


// Allow cross-origin requests
app.use(cors());

//CLOUDINARY SETUP++++++

// Allow cross-origin requests
app.use(cors());

// Cloudinary config
cloudinary.config({
	cloud_name: 'dbf34ckzm', // Cloudinary cloud name
	api_key: '251761166187897', // Cloudinary API key
	api_secret: 'dZlxwHSzUfJw189sJGH-g76dsBs' // Cloudinary API secret
});


//CLOUDINARY SETUP------

const port = process.env.PORT || 5000;

server.listen(port);
console.log("Server Running!");
var io = require('socket.io') (server, {});

var SOCKET_LIST = {};

var accountSessions = [];

io.sockets.on('connection', function(socket){//SOCKETS++++++
	SOCKET_LIST[socket.id] = socket;
	console.log("socket connection");
	var informationColumns = [
		"name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "media_adulthood", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine", "media_misc"
	];
	var credentialsColumns = ["email", "password", "accstatus", "visibility", "handle", "init"];

	socket.on("client", function(){
		console.log("client loaded.")
	});

	//check credentials for user login + send user information to client
	socket.on('attemptLogin', function(data){
		let email = data.email;
		let password = data.password;
		let stayLoggedIn = false; //replace with data.stayLoggedIn
		let response = "-";


		client.query('SELECT password FROM credentials WHERE email = $1;', [email])
			.then(results => {
				if(results.rows[0] != null && validateHash(password, results.rows[0].password)){
					return client.query('SELECT c.id, c.accstatus, c.email, c.visibility, c.handle, c.init, i.* FROM credentials c RIGHT JOIN information i ON c.id = i.id WHERE c.email = $1', [email])
					.then((results) =>{
						var dbResults = results.rows[0];//data string format
						var userInfo; //array of data that will be sent to client in addition to dbData
						
						// Check if dbResults is null or undefined
                        if (dbResults != null) {
                            // Parse only if dbResults is not null
                            var dbData = JSON.parse(JSON.stringify(dbResults)); // data JSON format

							//check if user is logged in elsewhere -> delete session and log them out
							for(i in accountSessions){

								//console log both to check if they match
								console.log("dbData.id: " + dbData.id);
								console.log("accountSessionID: " + accountSessions[i].accountID);

								if(dbData.id == accountSessions[i].accountID){
									// force logout client-side
									let sessionToLogout = accountSessions[i].accountSessionToken;
									io.emit("forceLogout", sessionToLogout)
									
									// delete session
									accountSessions.splice(i,1); //remove session entry
								}
							}

							var accountSessionToken = crypto.randomBytes(32).toString('hex');

                            if (dbData.accstatus == "active") {
								// final check, if user is active -> match sessionToken with accountID and push into active sessions
								let accountID = dbData.id;
								accountSessions.push({"accountID": accountID, "accountSessionToken": accountSessionToken});
                                
								response = "logged";
								dbData.id = 0; //hide primary key
                                userInfo = {stayLoggedIn, response, dbData};
                            }
							else if (dbData.accstatus == "inactive") {
                                response = "Your account is inactive.";
                                userInfo = {stayLoggedIn, response};
                            }
                        } else {
                            // Handle null result here
                            response = "no user data found";
                            userInfo = {stayLoggedIn, response};
                        }
						
						//send the information package to client
						socket.emit('confirmLogin', {userInfo, accountSessionToken});
					})
				}
				else{
					var msg = "Λανθασμένος συνδυασμός email και κωδικού χρήστη!"
					socket.emit('showMessage', msg);
				}
			})
			.catch(err => {
				console.error('Database query error:', err);
				socket.emit('showMessage', 'An error occurred: ' + err.message);
			})
	});

	//check credentials for SIGN UP
	socket.on('attemptSignup', function(data){
		let email = data.email.trim();
		let pass = data.password;
		let firstname = data.firstname;
		let lastname = data.lastname;

		let randomNumber = Math.random().toString().slice(2, 6);
		let handle = email.substring(0, 4) + randomNumber;
		
		//hash password given by user
		let password = hashPass(pass);
		
		client.query('SELECT email FROM credentials WHERE email = $1', [email])//check if email already exists
			.then(results => { 
				if(results.rows[0] != null && results.rows[0].email == email){
					var response = "Υπάρχει ήδη λογαριασμός με το συγκεκριμένο email.";
					socket.emit('show_error', response);
					return false;
				}
			})
			.then( () => { //if email doesnt already exist continue with account creation
				client.query('INSERT INTO credentials(email, password, accstatus, visibility, handle, init) VALUES($1, $2, $3, $4, $5, $6)', [email, password, 'active', 'private', handle, 'not_init']);
				client.query(`INSERT INTO information(name, surname, dob, pob, nickname, generalinfo, address, familynames, familyoccupations, pets, childhoodinfo, address_childhood, school_childhood, lovememories, memories_childhood_misc, media_childhood, studies, occupations, marriage, partnerinfo, kids, memories_adulthood_misc, media_adulthood, grandchildren, media_seniority, values, achievements, fav_foods, fav_scents, fav_fun, fav_seasons, fav_media, fav_memories, fav_music, fav_hobbies, fav_misc, leastfav, routine, media_misc, pfp) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40)
`, [firstname, lastname, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "[]", "-", "-", "-", "-", "-", "-", "[]", "-", "[]", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "[]", "-"]);
				//Database entry created. Inform client:
				socket.emit("showMessage", "Account Created!");
			})
			.catch(err => {
				console.error('Database query error:', err);
				socket.emit('showMessage', 'An error occurred');
			})
	});

	socket.on("updateUserInfo", function(updatePacket){//called when user updates/edits profile info
		for(i in accountSessions){
			if(updatePacket.sessionToken == accountSessions[i].accountSessionToken){
				let userID = accountSessions[i].accountID;

					if(informationColumns.includes(updatePacket.data_name)){
						client.query('UPDATE information SET ' + updatePacket.data_name + ' = $1 WHERE id = $2', [updatePacket.data_value, userID])
						.then(()=>{							
									// database updated
						})
						.catch(err => {
							console.error('Database query error:', err);
							socket.emit('showMessage', 'An error occurred');
						})
					}
					else{
						socket.emit("showMessage", "Invalid update request.");
					}
			}
			else{
				socket.emit("showMessage", "1 Invalid session or user not found.");
			}
		}
	});

	socket.on("updateCredentials", function(updatePacket){//called when user updates login credentials
		for(i in accountSessions){
			if(updatePacket.sessionToken == accountSessions[i].accountSessionToken){
				let userID = accountSessions[i].accountID;

				if(updatePacket.data_name == "password"){
					client.query('SELECT password FROM credentials WHERE id = $1', [userID]) // check if current password is correct
					.then(results => {
						if(results.rows[0] != null && validateHash(updatePacket.old_password, results.rows[0].password)){ //if current password was found and is correct
							client.query('UPDATE credentials SET password = $1 WHERE id = $2', [hashPass(updatePacket.data_value), userID]) //update password
							.then(()=>{							
								// database updated
							})
							.catch(err => {
								console.error('Database query error:', err);
								socket.emit('showMessage', 'An error occurred');
							})
						}
						else{
							socket.emit("showMessage", "Invalid update request.");
						}
					})
					.catch(err => {	
						console.error('Database query error:', err);
						socket.emit('showMessage', 'An error occurred');
					});
				}
				else if(updatePacket.data_name == "email"){
					client.query('UPDATE credentials SET email = $1 WHERE id = $2', [updatePacket.data_value, userID]) //update email
					.then(()=>{							
						// database updated
					})
					.catch(err => {
						console.error('Database query error:', err);
						socket.emit('showMessage', 'An error occurred');
					})
				}
				else if(updatePacket.data_name == "visibility"){ //update account visibility
					client.query('UPDATE credentials SET visibility = $1 WHERE id = $2', [updatePacket.data_value, userID]) //update email
					.then(()=>{							
						// database updated
					})
					.catch(err => {
						console.error('Database query error:', err);
						socket.emit('showMessage', 'An error occurred');
					})
				}
				else if(updatePacket.data_name == "init"){ //update account initialization status 
					client.query('UPDATE credentials SET init = $1 WHERE id = $2', [updatePacket.data_value, userID]) //update email
					.then(()=>{							
						// database updated
					})
					.catch(err => {
						console.error('Database query error:', err);
						socket.emit('showMessage', 'An error occurred');
					})
				}
				else{
					socket.emit("showMessage", "Invalid update request.");
				}
			}
			else{
				socket.emit("showMessage", "2 Invalid session or user not found.");
			}
		}
	});

	socket.on("updateMedia", function(updatePacket){//called when user updates/edits media
		for(i in accountSessions){
			if(updatePacket.sessionToken == accountSessions[i].accountSessionToken){
				let userID = accountSessions[i].accountID;
				
				//retrieve existing media URLs
				client.query('SELECT media_childhood, media_adulthood, media_seniority, media_misc FROM information WHERE id = $1', [userID])
				.then(results => {    
					if (results.rows.length > 0) {

						// Check which media box is being updated, push url in media column and update it.

						if(updatePacket.mediaType == "media_childhood"){ //media_childhood
							let media_childhood = JSON.parse(results.rows[0].media_childhood);
							media_childhood.push(updatePacket.fileUrl);
							media_childhood = JSON.stringify(media_childhood);
							client.query('UPDATE information SET media_childhood = $1 WHERE id = $2', [media_childhood, userID])
							.then(()=>{							
								// database updated
							})
							.catch(err => {
								console.error('Database query error:', err);
								socket.emit('showMessage', 'An error occurred');
							})
						}
						else if(updatePacket.mediaType == "media_adulthood"){ //media_adulthood
							let media_adulthood = JSON.parse(results.rows[0].media_adulthood);
							media_adulthood.push(updatePacket.fileUrl);
							media_adulthood = JSON.stringify(media_adulthood);
							client.query('UPDATE information SET media_adulthood = $1 WHERE id = $2', [media_adulthood, userID])
							.then(()=>{							
								// database updated
							})
							.catch(err => {
								console.error('Database query error:', err);
								socket.emit('showMessage', 'An error occurred');
							})
						}
						else if(updatePacket.mediaType == "media_seniority"){ //media_seniority
							let media_seniority = JSON.parse(results.rows[0].media_seniority);
							media_seniority.push(updatePacket.fileUrl);
							media_seniority = JSON.stringify(media_seniority);
							client.query('UPDATE information SET media_seniority = $1 WHERE id = $2', [media_seniority, userID])
							.then(()=>{							
								// database updated
							})
							.catch(err => {
								console.error('Database query error:', err);
								socket.emit('showMessage', 'An error occurred');
							})
						}
						else if(updatePacket.mediaType == "media_misc"){ //media_misc
							let media_misc = JSON.parse(results.rows[0].media_misc);
							media_misc.push(updatePacket.fileUrl);
							media_misc = JSON.stringify(media_misc);
							client.query('UPDATE information SET media_misc = $1 WHERE id = $2', [media_misc, userID])
							.then(()=>{							
								// database updated
							})
							.catch(err => {
								console.error('Database query error:', err);
								socket.emit('showMessage', 'An error occurred');
							})
						}
						else{
							socket.emit("showMessage", "Invalid media update request.");
						}
						
					} else {
						console.log("No data found.");
					}

				})
				.catch(err => {
					console.error('Database query error:', err);
					socket.emit('showMessage', 'An error occurred');
				})			
			}
			else{
				socket.emit("showMessage", "3 Invalid session or user not found.");
			}
		}
	});

	socket.on("logout", function(sessionToken){
		for(i in accountSessions){
			if(sessionToken == accountSessions[i].accountSessionToken){
				accountSessions.splice(i,1); //remove accountSessions entry when user logs out
			}
		}
	});


	socket.on("searchUser", function(handle){
		var userInfo; //array of data that will be sent to client in addition to dbData

		client.query('SELECT id, visibility, handle FROM credentials WHERE handle = $1;', [handle])
			.then(results => {
				//check if account visibility is set to public
				if(results.rows[0] != null && results.rows[0].visibility === "visible"){
					client.query('SELECT i.* FROM information i WHERE id = $1', [results.rows[0].id])
						.then((results) =>{
							var dbResults = results.rows[0];//data string format

							dbResults.id = 0; //hide primary key

							let found = true;
							userInfo = {found, dbResults};
							
							socket.emit("searchResults", userInfo);
						});
				}
				else{
					let found = false;
					userInfo = {found};

					socket.emit("searchResults", userInfo);
				}
			});
	});

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