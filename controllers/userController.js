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

        //generate 20 bit activationn  code, crypto  is build  in package node.js
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
                    html: 'Please click <a href="' + link + '"> here </a to activate your account'
                })

                user.save(function(err,user){
                    if(err) return next(err)
                    res.status(201).json({
                        success: true,
                        msg: 'The activation  email has been sent to' + user.email + 'please click the activation link  within 24 hours.'
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