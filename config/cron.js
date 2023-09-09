const { CSM_Broadcast } = require('../models');
const { scheduleBroadcast } = require('../services/broadcast.service');

const metaBroadcastSynchronize = async () => {
  const scheduledBroadcasts = await CSM_Broadcast.findAll({ where: { status: 'Scheduled' } });

  scheduledBroadcasts.forEach(async (broadcast) => {
    await scheduleBroadcast(broadcast.id);
  });
};

module.exports = {
  metaBroadcastSynchronize,
};
