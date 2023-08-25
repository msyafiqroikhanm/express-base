require('dotenv').config();
const router = require('express').Router();
const authRoutes = require('./auth.routes');
const configRoutes = require('./sysConfiguration.routes');
const referenceRoutes = require('./reference.routes');
const qrTemplateRoutes = require('./qrTemplate.routes');
const qrRoutes = require('./qr.routes');
const moduleRoutes = require('./module.routes');
const featureRoutes = require('./feature.routes');
const roleRoutes = require('./role.routes');

router.use('/auth', authRoutes);
router.use('/config', configRoutes);
router.use('/reference', referenceRoutes);
router.use('/qr-templates', qrTemplateRoutes);
router.use('/qrs', qrRoutes);
router.use('/modules', moduleRoutes);
router.use('/features', featureRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
