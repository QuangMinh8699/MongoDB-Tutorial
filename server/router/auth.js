const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// router.get('/', (req, res) => res.send('USER ROUTER'))
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    // simple validation
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Missing username or password' })

    try {
        // check for existing user
        const user = await User.findOne({ username })

        if (user)
            return res
                .status(400)
                .json({ success: false, message: 'Username already taken' })

        // all good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            username,
            password: hashedPassword
        })
        await newUser.save()

        // return token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({ success: true, message: 'user created successfully', accessToken })
    } catch (error) {

    }
})

module.exports = router