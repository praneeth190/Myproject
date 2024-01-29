const mongoose = require("mongoose");

// Connect to the "users" database
const userConnection = mongoose.createConnection("mongodb://localhost:27017/users");

userConnection.on('connected', () => {
  console.log("Connected to the 'users' database");
});

userConnection.on('error', (error) => {
  console.error("Failed to connect to 'users' database:", error);
});



const LoginSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


const dataschema = new mongoose.Schema({
  name: String,
  email: String,
  collegeName: String,
  yearOfStudy:String,
  branch: String,
  groupMembers: String,
  mentor: String,
  projectName: String,
  genre: String,
  spanOfProjectTime: String,
  description: String,
  projectInfo: String,
  urlink: String

});


const collection = userConnection.model("collection1", LoginSchema);
const datamodel = userConnection.model("datas", dataschema);

console.log('Connected to Eduhub database and using data collection.');

module.exports = { collection, datamodel };
