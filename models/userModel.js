const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true,
        minLength : [6,"Password must be atleast 6 characters long"]
    }
});

const hash_password = async (password)=>{
    password = await bcrypt.hash(password,10);
    return password;
}

const check_password = async (hashed_password, original_password)=>{
    return await bcrypt.compare(original_password, hashed_password);
}

userSchema.pre("save",async function(next){
    if(this.password && this.isModified("password")){
        this.password = await hash_password(this.password);
    }
    next();
});

userSchema.statics.check_credentials = async function(email,password){
    const userDetails = await this.findOne({email : email});
   
    if(userDetails && await check_password(userDetails.password, password)){
        return userDetails;
    }
    throw new Error("User Credentials don't match");
}

const User = model("User",userSchema);
module.exports = User;