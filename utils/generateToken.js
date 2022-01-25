const jwt = require('jsonwebtoken')

//payload will be added to the jwt that is in  the encoded form
//it will take the JWT constant
const generateToken = (payload) =>{
    return jwt.sign({payload}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = generateToken;