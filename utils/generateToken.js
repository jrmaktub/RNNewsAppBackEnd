const jwt = require('jsonwebtoken')

//payload will be added to the jwt that is in  the encoded form
//it will take the JWT constant
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = generateToken;