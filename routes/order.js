const router = require('express').Router()
const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require('./verification')
const Order = require('../models/Order')

//Create order

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//update order
router.put("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,

            req.body
            ,
            { new: true }
        )
        res.status(200).json(updatedOrder)
    } catch (err) { res.status(500).json(err) }
})

//delete stuff

router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order deleted")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// GET USER ORDERs
router.get("/find/:userId", verifyTokenAuth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(order)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get all order
router.get("/", verifyTokenAdmin, async (req, res) => {
    try {
        const orders = await Order.find()

        res.status(200).json(orders)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//get monthly income
router.get("/income", verifyTokenAdmin, async (req, res) => {
    const productId = req.query.pid
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: prevMonth }, ...(productId && {
                        products: {
                            $elemMatch: { productId }
                        }
                    } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum:"$sales"}
                }
            }
        ])
        res.status(200).send(income)
    }
    catch (err) {
        res.status(500).json(err)
    }

})

module.exports = router