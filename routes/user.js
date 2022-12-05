const router = require('express').Router()
const { verifyToken, verifyTokenAuth,verifyTokenAdmin } = require('./verification')
const User = require('../models/User')


//update info
router.put("/:id", verifyTokenAuth, async (req, res) => {
    if (req.body.password) {
        password: CryptoJS.AES.encrypt(req.body.password, process.env.passkey).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            
               req.body
            ,
            { new: true }
        )
        res.status(200).json(updatedUser)
    } catch (err) {res.status(500).json(err)}
})

//delete stuff

router.delete("/:id", verifyTokenAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// find user
router.get("/find/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const user =await User.findById(req.params.id)
        const { password, ...others } = user._doc
        
        res.status(200).json(others)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get all user 
router.get("/", verifyTokenAdmin, async (req, res) => {
    const query = req.query.latest
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(3)
            : await User.find()
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.get("/stats", verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
    console.log("TEST")
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    }
    catch (err) {
        ress.status(500).json(err)
    }
})
module.exports = router