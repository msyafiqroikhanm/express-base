const { Op } = require('sequelize');
const {
  PAR_Participant, REF_Region, PAR_Contingent, ENV_Event, PAR_Group,
} = require('../models');

const participantDasboard = async (limitation = null) => {
  const totalParticipant = await PAR_Participant.count({
    where: limitation ? { contingentId: limitation.id } : { contingentId: { [Op.not]: null } },
  });

  // * Participant / Region
  const participantPerRegion = await REF_Region.findAll({
    attributes: ['id', 'name'],
    include: [
      {
        model: PAR_Contingent,
        as: 'contingents',
        where: limitation ? { id: limitation.id } : null,
        attributes: ['id'],
        include: {
          model: PAR_Participant,
          as: 'participants',
          attributes: ['id'],
        },
      },
    ],
  });
  const regionCounts = participantPerRegion.map((region) => {
    const participantCount = region.contingents.reduce(
      (sum, contingent) => sum + Number(contingent.participants?.length),
      0,
    );
    return {
      id: region.id,
      name: region.name,
      participantCount,
    };
  });

  // * Participant / Event
  const participantPerEvent = await ENV_Event.findAll({
    attributes: ['id', 'name'],
    include: [
      {
        model: PAR_Group,
        include: {
          model: PAR_Participant,
          where: limitation ? { contingentId: limitation.id } : null,
          attributes: ['id'],
        },
      },
    ],
  });
  const eventCounts = participantPerEvent.map((event) => {
    const participantCount = event.PAR_Groups.reduce(
      (sum, contingent) => sum + Number(contingent.PAR_Participants?.length),
      0,
    );
    if (limitation && participantCount === 0) {
      return null;
    }
    return {
      id: event.id,
      name: event.name,
      participantCount,
    };
  });

  return {
    totalParticipant,
    participantPerRegion: regionCounts,
    participantPerEvent: eventCounts?.filter((event) => event !== null) || null,
  };
};

const selectDashboard = async (limitation, models = []) => {
  const dashboard = [];

  if (models.includes('Participant Management')) {
    const participant = await participantDasboard(limitation?.contingent || null);
    dashboard.push({ participant });
  }
  return {
    success: true,
    message: 'Successfully Getting Dashboard',
    content: dashboard,
  };
};

module.exports = {
  selectDashboard,
};
