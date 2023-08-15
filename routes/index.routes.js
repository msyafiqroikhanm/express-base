require('dotenv').config();
const router = require('express').Router();
const authRoutes = require('./auth.routes');

router.get('/', (req, res) => res.send(`${process.env.APP_NAME} App `));
router.use('/auth', authRoutes);

module.exports = router;
