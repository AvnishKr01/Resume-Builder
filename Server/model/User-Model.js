const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},
{ timestamps: true });

//Hashing password before saving user
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

//compare password method
userSchema.methods.comparedPassword = async function(enateredPassword){
    return await bcrypt.compare(enateredPassword, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;