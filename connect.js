const { connect } = require("mongoose");

const connectDb = async (MONGO_URI)=>{
    await connect(MONGO_URI);
    console.log("Connected to the database");
}

module.exports = connectDb;