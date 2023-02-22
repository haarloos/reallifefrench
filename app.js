// import/require all the nodejs modules that we need
// - express to talk create a nodejs server
// - cors to be able to send http queries
// - sequelize to communicate with the database
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

// create a nodejs server using express.
// -> make sure it uses cors for its queries.
// -> choose a port for the localhost
const server = express();
server.use(cors());
const port = 3000;

// create sequelize object
// -> tell it it's a sqlite database
// -> say which database it is looking for
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./dictionaryDatabase.db",
});

// define new model/schema using sequelize
// - sequelize creates a object-based definition of a database
// - this allows sequelize to access the database without us writing pure SQL
const dictionaryData = sequelize.define(
	// the table name is defined here
	"dictionaryData",
	// and here the columns of the table are defined
	// - make sure the names and characteristics are correct
	// - it appears the id column does not need to be defined
	{
		originalWord: {
			type: DataTypes.STRING,
		},
		definition: {
			type: DataTypes.STRING,
		},
		species: {
			type: DataTypes.STRING,
		},
		example: {
			type: DataTypes.STRING,
		},
		relation: {
			type: DataTypes.STRING,
		},
		story: {
			type: DataTypes.STRING,
		},
	},
	// here we can define options for the table
	// - we did not create timestamps for the records in this table
	// - sqlite goes looking for timestamps "createdAt" and "updatedAt" by default
	// - we do not want that, so timestamps are set to false
	{
		timestamps: false
	}
);

// now that we define a table in sequelize, we want to sync it with our actual sqlite database
// if the database already exists it is not created again
// - we want the script to wait before this is completed
// -> so we define an asynchronous function to be able to use await
const synchronizeDatabase = async () => {
	await dictionaryData.sync();
};
// perform the actual synchronization
synchronizeDatabase();

// create a http route that returns all words in the database on request
// - a route is not executed unless called upon
// - the function finds all the data in dictionaryData
// - the function is made asynchronous so we can use await
// - await makes sure the collectedData is not send before findAll is completed
// - if you want to check if it works, go to localhost:port/route (localhost:3000/gatherDictionaryData at time of writing this comment)
server.get("/gatherDictionaryData", async (req, res) => {
	const collectedData = await dictionaryData.findAll();
	res.send(collectedData);
});

// tell the server to listen on the port defined at the top of the file
server.listen(port, () => {
	// log a message if the function is working
	console.log(`Example app listening on port ${port}`);
});
