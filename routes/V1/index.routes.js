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
const userRoutes = require('./user.routes');
const eventRoutes = require('./event.routes');
const contingentRoutes = require('./continget.routes');
const groupRoutes = require('./group.routes');
const participantRoutes = require('./participant.routes');
const chatbotResponseRoutes = require('./chatbotResponse.routes');
const feedbackRoutes = require('./customerFeedback.routes');
const faqRoutes = require('./faq.routes');

router.use('/auth', authRoutes);
router.use('/config', configRoutes);
router.use('/reference', referenceRoutes);
router.use('/qr-templates', qrTemplateRoutes);
router.use('/qrs', qrRoutes);
router.use('/modules', moduleRoutes);
router.use('/features', featureRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/contingents', contingentRoutes);
router.use('/groups', groupRoutes);
router.use('/participants', participantRoutes);
router.use('/chatbot-responses', chatbotResponseRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/faqs', faqRoutes);

module.exports = router;
