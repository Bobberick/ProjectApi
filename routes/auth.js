const router = require('express').Router()
const User = require("../models/User")
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

//register / dang ky

router.post("/register", async (req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password,process.env.passkey)
    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) { res.status(500).json(err)}
})

//login / dang nhap

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username:req.body.username})
        if (!user)
            res.status(401).json("Wrong credential")
        else {
            const hashPass = CryptoJS.AES.decrypt(user.password, process.env.passkey)

            const OriginPassword = hashPass.toString(CryptoJS.enc.Utf8)

            if (OriginPassword !== req.body.password) res.status(401).json("Wrong Password")
            else {
                const Token = jwt.sign({
                    id: user.id,
                    isAdmin: user.isAdmin
                }, process.env.jwtkey, { expiresIn: "10m"})

                const {password, ...others} = user._doc

                res.status(200).json({ ...others, Token })
            }
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router