const router = require('express').Router()
const stripe = require('stripe')(process.env.stripekey)

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "aud",
    }, (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).json(stripeErr)
            } else {
                res.status(200).json(stripeRes)
            }
    })
})

module.exports = router