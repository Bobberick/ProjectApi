const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.jwtkey, (err, user) => {
            if (err) res.status(403).json("Token is invalid")
            else {
                req.user = user
                next()
            }
        })
    } else {
        return res.status(401).json("Not Authenticated")
    }
} 

const verifyTokenAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin == "true") {
            next()
        } else {
            res.status(403).json("Access Denied")
        }

    })
}

const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin == "true") {
            next()
        } else {
            res.status(403).json("Access Denied")
        }

    })
}

module.exports = { verifyToken, verifyTokenAuth,verifyTokenAdmin}