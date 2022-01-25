//require is equal to import
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: 'string',
            required: true
        },
        email : {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        avatar: {
            type: 'string',
            default: ''
        },
        active: {
            type: Boolean,
            default: false
        },
        activeToken: String,
        activeExpires: Date
    }
)
//matching if the password entered by User is the same as the password in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//will run save
//before running save, it  will run the next API.
//if password is not modified then we will modify the password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    //generating  10 length string 
    const salt = await bcrypt.genSalt(10);
    //hashing with the password to random strings to encrypt it
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)