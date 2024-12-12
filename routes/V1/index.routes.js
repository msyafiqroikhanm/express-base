require('dotenv').config();
const router = require('express').Router();
const authRoutes = require('./auth.routes');
const configRoutes = require('./sysConfiguration.routes');
const referenceRoutes = require('./reference.routes');
const moduleRoutes = require('./module.routes');
const featureRoutes = require('./feature.routes');
const roleRoutes = require('./role.routes');
const userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/config', configRoutes);
router.use('/reference', referenceRoutes);
router.use('/modules', moduleRoutes);
router.use('/features', featureRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);

module.exports = router;
