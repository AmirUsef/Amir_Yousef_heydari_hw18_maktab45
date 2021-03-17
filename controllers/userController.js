const User = require('../models/User');
const bcrypt = require('bcrypt');
const session = require('express-session');

const fieldsPattern = [
    "newpassword",
    "password",
    "email",
    "gender"
];

const dashboardPage = (req, res) => {
    res.render('dashboard', { user: req.session.user })
}

const updateUser = (req, res) => {
    const keys = Object.keys(req.body);
    const validateBody = keys.every((field) => fieldsPattern.includes(field))
    if (!req.session.user || !validateBody)
        return res.status(400).send()

    User.findOne({ _id: req.session.user._id }, (err, user) => {
        if (err || !user) return res.status(500).send()

        if (keys.includes("password") || keys.includes("newpassword")) {
            bcrypt.compare(req.body.password.trim(), user.password, function(err, isEqual) {
                if (err) return res.status(500).send()

                if (!isEqual) return res.status(404).send()

                user.updateOne({ password: req.body.newpassword.trim() }, { new: true, runValidators: true, useFindAndModify: false }, (err, user) => {
                    if (err) return res.status(500).send()

                    return res.status(200).send()
                })
            });
        }
        User.findByIdAndUpdate({ _id: req.session.user._id }, req.body, { new: true, runValidators: true, useFindAndModify: false }, (err, user) => {
            if (err) {
                if (err.code == 11000) return res.status(409).send()

                return res.status(500).send()
            }
            req.session.user = user
            res.status(200).send()
        })
    })
}

const deleteUser = (req, res) => {
    if (!req.session.user)
        return res.status(400).send()

    User.findOneAndDelete({ _id: req.session.user._id }, (err, user) => {
        if (err) return res.status(500).send();

        res.clearCookie('user_sid')
        res.status(202).send();
    })
}

module.exports = {
    dashboardPage,
    updateUser,
    deleteUser
};