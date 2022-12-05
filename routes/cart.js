const router = require('express').Router()
const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require('./verification')
const Cart = require('../models/Cart')

//Create cart

router.post("/",verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//update cart
router.put("/:id", verifyTokenAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,

            req.body
            ,
            { new: true }
        )
        res.status(200).json(updatedCart)
    } catch (err) { res.status(500).json(err) }
})

//delete stuff

router.delete("/:id", verifyTokenAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart deleted")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// GET USER Cart
router.get("/find/:userId",verifyTokenAuth, async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId })
        res.status(200).json(cart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get all cart
router.get("/",verifyTokenAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()

        res.status(200).json(carts)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router