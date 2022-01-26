const User  = require('../models/UserModel')
const mailer =  require('../utils/Mailer')
const generateToken = require('../utils/generateToken')
const crypto = require('crypto')

const registerUser  = async (req,res,next) => {
    try {
        const {name, email, password} = req.body;

        const userExists = await User.findOne({ email})

        if (userExists && userExists.active){
            return res.status(400).json({
                success: false,
                msg: 'Entered email id is already registered'
            })
        }else if (userExists && !userExists.active){
            return res.status(400).json({
                success: false,
                msg: 'Account created but need to activate. A link sent with your registered phone '
            })
        }

        const user = new User({
            name, email, password 
        })

        //generate 20 bit activationn  code with crypto module built  in package node.js
        crypto.randomBytes(20, function (err, buf) {
            //ensure activation link is unique
            user.activeToken = user._id + buf.toString('hex')

            //set expiration time is 24 hours
            user.activeExpires = Date.now() + 24 *  3600 *  1000
            var link = process.env.NODE_ENV == 'development' ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}`
                : `${process.env.api_host}/api/users/active/${user.activeToken}`

                //sending activation mail
                mailer.send({
                    to: req.body.email,
                    subject: 'Welcome',
                    html: 'Please click <a href="' + link + '"> here </a> to activate your account'
                })
                //save user object
                user.save(function(err,user){
                    if(err) return next(err)
                    res.status(201).json({
                        success: true,
                        msg: 'The activation  email has been sent to ' + user.email + ' please click the activation link  within 24 hours.'
                    })
                })
        })


    }catch (error){
        console.log(error)
        res.status(500).json({
            success: false,
            msg: 'Server having some issues'
        })
    }
}

const activeToken = async (req, res, next) =>{

    //find the corresponding user
    User.findOne({
        //getting the params from the url request
        activeToken: req.params.activeToken,
        // activeExpires: {$gt:Date.now()}

    }, function(err, user) {
        if(err) return next(err);

        //if invalid activation code means no user holding token
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Your activation link is invalid'
            });
        }

        if(user.active == true){
            return res.status(200).json({
                success: true,
                msg: 'Your activation is already activated'
            })
        }

        //if not activated it, activate it and save
        user.active = true;
        user.save(function(err,user){
            if(err) return next(err);

            //activation success
            res.json({

                success: true,
                msg: 'Activation success'

            })
        })
        


    })
}

const autUser = async(req, res) => {
    const {email, password} = req.body;

    //fetching User and checking email
    const user = await User.findOne({email})
    //matching the inputed password using the inherited matchPassword from UserSchema
    //later this password is compared with the password in the database
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    }else {
        res.status(401).json({
            success: false,
            msg: 'Unauthorized user'
        })
    }

}

const getUserProfile = async (req, res) =>{
    const user = await User.findById(req.header._id)

    if(user){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        })
    }else {
        res.status(404).json({
            success: false,
            msg: "User not found"
        })
    }
}

module.exports = {
    registerUser,
    activeToken,
    autUser,
    getUserProfile
}