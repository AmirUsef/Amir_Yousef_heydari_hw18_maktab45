const express = require("express");
const router = express.Router();
const userRouter = require('./user');
const authRouter = require('./authentication');

router.use('/user', userRouter);
router.use('/auth', authRouter)

module.exports = router;