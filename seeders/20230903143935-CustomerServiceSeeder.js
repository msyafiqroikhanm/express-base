/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* CSM_ChatbotResponses
    const csm_chatbotresponses = JSON.parse(
      fs.readFileSync('./seeders/data/csm_chatbotresponses.json'),
    );
    const responses = csm_chatbotresponses.map((element) => ({
      responseTypeId: element.responseTypeId,
      message: element.message,
      isActive: element.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_ChatbotResponses', responses);

    //* CSM_CustomerFeedbacks
    const csm_customerfeedbacks = JSON.parse(
      fs.readFileSync('./seeders/data/csm_customerfeedbacks.json'),
    );
    const customerfeedbacks = csm_customerfeedbacks.map((element) => ({
      typeId: element.typeId,
      targetId: element.targetId,
      statusId: element.statusId,
      customerName: element.customerName,
      message: element.message,
      longtitude: element.longtitude,
      latitude: element.latitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_CustomerFeedbacks', customerfeedbacks);

    //* CSM_FAQs
    const csm_faqs = JSON.parse(
      fs.readFileSync('./seeders/data/csm_faqs.json'),
    );
    const faqs = csm_faqs.map((element) => ({
      parentFAQId: element.parentFAQId,
      typeId: element.typeId,
      isMain: element.isMain,
      title: element.title,
      message: element.message,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_FAQs', faqs);

    //* CSM_InformationCenters
    const csm_informationcenters = JSON.parse(
      fs.readFileSync('./seeders/data/csm_informationcenters.json'),
    );
    const informationcenters = csm_informationcenters.map((element) => ({
      title: element.title,
      description: element.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_InformationCenters', informationcenters);

    //* CSM_InformationCenterTargets
    const csm_informationcentertargets = JSON.parse(
      fs.readFileSync('./seeders/data/csm_informationcentertargets.json'),
    );
    const informationcentertargets = csm_informationcentertargets.map((element) => ({
      informationCenterId: element.informationCenterId,
      participantTypeId: element.participantTypeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_InformationCenterTargets', informationcentertargets);

    //* CSM_BroadcastTemplates
    const csm_broadcasttemplates = JSON.parse(
      fs.readFileSync('./seeders/data/csm_broadcasttemplates.json'),
    );
    const broadcasttemplates = csm_broadcasttemplates.map((element) => ({
      categoryId: element.categoryId,
      metaCategoryId: element.metaCategoryId,
      headerTypeId: element.headerTypeId,
      languageId: element.languageId,
      name: element.name,
      message: element.message,
      messageVariableNumber: element.messageVariableNumber,
      messageVariableExample: JSON.stringify(element.messageVariableExample),
      headerText: element.headerText,
      headerVariableExample: JSON.stringify(element.headerVariableExample),
      footer: element.footer,
      button: JSON.stringify(element.button),
      metaStatus: element.metaStatus,
      metaId: element.metaId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_BroadcastTemplates', broadcasttemplates);

    //* CSM_Broadcasts
    const csm_broadcasts = JSON.parse(
      fs.readFileSync('./seeders/data/csm_broadcasts.json'),
    );
    const broadcasts = csm_broadcasts.map((element) => ({
      templateId: element.templateId,
      name: element.name,
      status: element.status,
      sentAt: new Date(element.sentAt),
      messageParameters: JSON.stringify(element.messageParameters),
      buttonParameters: JSON.stringify(element.buttonParameters),
      headerFile: element.headerFile,
      headerText: element.headerText,
      description: element.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_Broadcasts', broadcasts);

    //* CSM_BroadcastParticipants
    const csm_broadastparticipants = JSON.parse(
      fs.readFileSync('./seeders/data/csm_broadastparticipants.json'),
    );
    const broadastparticipants = csm_broadastparticipants.map((element) => ({
      participantId: element.participantId,
      broadcastId: element.broadcastId,
      status: element.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('CSM_BroadcastParticipants', broadastparticipants);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CSM_ChatbotResponses', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('CSM_CustomerFeedbacks', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('CSM_FAQs', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('CSM_InformationCenters', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('CSM_InformationCenterTargets', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('CSM_BroadcastTemplates', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('CSM_Broadcasts', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('CSM_BroadcastParticipants', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
