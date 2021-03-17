const User = require('../models/User');
const bcrypt = require('bcrypt');

const fieldsPattern = [
    "username",
    "password",
    "email",
    "gender"
];

const rgisterPage = (req, res) => {
    res.render('auth/register')
}

const register = (req, res) => {
    const keys = Object.keys(req.body);
    const validateBody = fieldsPattern.every((field) => keys.includes(field))
    if (!validateBody || keys.length != 4)
        return res.status(400).send()

    User.findOne({ username: req.body.username.trim() }, (err, user) => {
        if (err) return res.status(500).send()

        if (user) return res.status(409).send()

        User.findOne({ email: req.body.email.trim() }, (err, user) => {
            if (err) return res.status(500).send()

            if (user) return res.status(409).send()

            new User(req.body).save((err, user) => {
                if (err) return res.status(500).send()

                res.status(201).send()
            })
        })
    })
}

const loginPage = (req, res) => {
    res.render('auth/login')
}

const login = (req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("username") || !keys.includes("password") || keys.length != 2)
        return res.status(400).send()

    User.findOne({ username: req.body.username.trim() }, (err, user) => {
        if (err) return res.status(500).send()

        if (!user) return res.status(404).send()

        bcrypt.compare(req.body.password.trim(), user.password, function(err, isEqual) {
            if (err) return res.status(500).send()

            if (!isEqual) return res.status(404).send()

            req.session.user = user
            res.status(200).send()
        });
    })
}

const logout = (req, res) => {
    res.clearCookie('user_sid').redirect('/auth/loginPage')
};

module.exports = {
    rgisterPage,
    register,
    loginPage,
    login,
    logout
};