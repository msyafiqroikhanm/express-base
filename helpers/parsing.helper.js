const parsingUserModules = (userInstance) => {
  // get parsed feature and module in user
  const parsedFeatures = [];
  userInstance.Role.USR_Features.forEach((feature) => {
    parsedFeatures.push({
      id: feature.dataValues.id,
      name: feature.dataValues.name,
      moduleId: feature.USR_Module.dataValues.id,
      modulesName: feature.USR_Module.dataValues.name,
      parentModuleId: feature.USR_Module.parentModule?.dataValues.id || null,
      parentModule: feature.USR_Module.parentModule?.dataValues.name || null,
    });
  });

  const outputObject = {};

  parsedFeatures.forEach((item) => {
    const {
      id: featureId,
      name: featurename,
      moduleId: subModuleId,
      modulesName: subModule,
      parentModuleId,
      parentModule,
    } = item;

    if (parentModuleId === null && parentModule === null) {
      // If both parentModuleId and parentModule are null, it's a main module
      if (!outputObject[subModuleId]) {
        outputObject[subModuleId] = {
          parentModuleId: subModuleId,
          parentModule: subModule,
          features: [],
        };
      }

      outputObject[subModuleId].features.push({
        featureId,
        featurename,
      });
    } else {
      // If parentModuleId is not null, it's a submodule
      if (!outputObject[parentModule]) {
        outputObject[parentModule] = {
          parentModuleId,
          parentModule,
          submodules: [],
        };
      }

      const existingSubmodule = outputObject[parentModule].submodules.find(
        (submodule) => submodule.subModuleId === subModuleId,
      );

      if (existingSubmodule) {
        existingSubmodule.features.push({
          featureId,
          featurename,
        });
      } else {
        outputObject[parentModule].submodules.push({
          subModuleId,
          subModule,
          features: [
            {
              featureId,
              featurename,
            },
          ],
        });
      }
    }
  });

  return Object.values(outputObject);
};

const parsingEventContingents = (groups) => {
  const contingentObject = {};

  groups.forEach((group) => {
    if (!contingentObject[group.contingentId]) {
      contingentObject[group.contingentId] = {
        name: group.contingent.name,
        participants: group.PAR_Participants?.length > 0 ? group.PAR_Participants : [],
      };
    } else {
      contingentObject[group.contingentId].participants.push(...group.PAR_Participants);
    }
  });

  const parsedContingents = Object.keys(contingentObject).map((contingentId) => ({
    contingentId: Number(contingentId),
    name: contingentObject[contingentId].name,
    participants: contingentObject[contingentId].participants,
  }));

  // Sort the array of objects by the "name" property of the contingent
  parsedContingents.sort((a, b) => a.name.localeCompare(b.name));

  // Sort the "participants" array inside each contingent by the "name" property
  parsedContingents.forEach((item) => {
    item.participants.sort((a, b) => a.name.localeCompare(b.name));
  });

  return parsedContingents;
};

module.exports = {
  parsingUserModules,
  parsingEventContingents,
};
