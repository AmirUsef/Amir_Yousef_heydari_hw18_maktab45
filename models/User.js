const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const requiredFields = {
    type: String,
    required: true,
    trim: true,
    // maxlength: 30,
};

const UserSchema = new Schema({
    username: {
        ...requiredFields,
        unique: true,
        minlength: 3,
        lowercase: true,
    },
    password: {
        ...requiredFields,
        minlength: 8
    },
    email: {
        ...requiredFields,
        minlength: 8,
        unique: true,
        lowercase: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', function(next) {
    const user = this
    if (this.isNew || this.isModified()) {
        console.log(1);
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else
        next()
});

UserSchema.pre('updateOne', function(next) {
    let user = this.getUpdate()
    if (user.password) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else
        next()

})

module.exports = mongoose.model('User', UserSchema);