/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* REF_configurationCategory
    const ref_configurationcategories = JSON.parse(fs.readFileSync('./seeders/data/ref_configurationcategories.json'));
    const categories = ref_configurationcategories.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_ConfigurationCategories', categories);

    //* REF_qrtype
    const ref_qrtypes = JSON.parse(fs.readFileSync('./seeders/data/ref_qrtypes.json'));
    const qrTypes = ref_qrtypes.map((element) => ({
      name: element.name,
      label: element.label,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_QRTypes', qrTypes);

    //* REF_EventCategories
    const ref_eventcategories = JSON.parse(fs.readFileSync('./seeders/data/ref_eventcategories.json'));
    const eventCategories = ref_eventcategories.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_EventCategories', eventCategories);

    //* REF_Regions
    const ref_regions = JSON.parse(fs.readFileSync('./seeders/data/ref_regions.json'));
    const regions = ref_regions.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_Regions', regions);

    //* REF_GroupStatuses
    const ref_groupstatuses = JSON.parse(fs.readFileSync('./seeders/data/ref_groupstatuses.json'));
    const groupStatuses = ref_groupstatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_GroupStatuses', groupStatuses);

    //* REF_ParticipantTypes
    const ref_participanttypes = JSON.parse(fs.readFileSync('./seeders/data/ref_participanttypes.json'));
    const participantTypes = ref_participanttypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_ParticipantTypes', participantTypes);

    //* REF_IdentityTypes
    const ref_identitytypes = JSON.parse(fs.readFileSync('./seeders/data/ref_identitytypes.json'));
    const identityTypes = ref_identitytypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_IdentityTypes', identityTypes);

    //* REF_LocationTypes
    const ref_locationtypes = JSON.parse(fs.readFileSync('./seeders/data/ref_locationtypes.json'));
    const locationTypes = ref_locationtypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_LocationTypes', locationTypes);

    //* REF_RoomTypes
    const ref_roomtypes = JSON.parse(fs.readFileSync('./seeders/data/ref_roomtypes.json'));
    const roomTypes = ref_roomtypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_RoomTypes', roomTypes);

    //* REF_RoomStatuses
    const ref_roomstatuses = JSON.parse(fs.readFileSync('./seeders/data/ref_roomstatuses.json'));
    const roomStatuses = ref_roomstatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_RoomStatuses', roomStatuses);

    //* REF_LodgerStatuses
    const ref_lodgerstatuses = JSON.parse(fs.readFileSync('./seeders/data/ref_lodgerstatuses.json'));
    const lodgerStatuses = ref_lodgerstatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_LodgerStatuses', lodgerStatuses);

    //* REF_ChatBotResponseTypes
    const ref_chatbotresponsetypes = JSON.parse(fs.readFileSync('./seeders/data/ref_chatbotresponsetypes.json'));
    const responsetypes = ref_chatbotresponsetypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_ChatBotResponseTypes', responsetypes);

    //* REF_FeedbackTypes
    const ref_feedbacktypes = JSON.parse(fs.readFileSync('./seeders/data/ref_feedbacktypes.json'));
    const feedbacktypes = ref_feedbacktypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_FeedbackTypes', feedbacktypes);

    //* REF_FeedbackTargets
    const ref_feedbacktargets = JSON.parse(fs.readFileSync('./seeders/data/ref_feedbacktargets.json'));
    const feedbacktargets = ref_feedbacktargets.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_FeedbackTargets', feedbacktargets);

    //* REF_FeedbackStatuses
    const ref_feedbackstatuses = JSON.parse(fs.readFileSync('./seeders/data/ref_feedbackstatuses.json'));
    const feedbackStatuses = ref_feedbackstatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_FeedbackStatuses', feedbackStatuses);

    //* REF_FAQTypes
    const ref_faqtypes = JSON.parse(fs.readFileSync('./seeders/data/ref_faqtypes.json'));
    const faqtypes = ref_faqtypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_FAQTypes', faqtypes);

    //* REF_TemplateCategories
    const ref_templatecategories = JSON.parse(fs.readFileSync('./seeders/data/ref_templatecategories.json'));
    const templatecategories = ref_templatecategories.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_TemplateCategories', templatecategories);

    //* REF_MetaTemplateCategories
    const ref_metatemplatecategories = JSON.parse(fs.readFileSync('./seeders/data/ref_metatemplatecategories.json'));
    const metatemplatecategories = ref_metatemplatecategories.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_MetaTemplateCategories', metatemplatecategories);

    //* REF_TemplateHeaderTypes
    const ref_templateheadertype = JSON.parse(fs.readFileSync('./seeders/data/ref_templateheadertype.json'));
    const templateheadertype = ref_templateheadertype.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_TemplateHeaderTypes', templateheadertype);

    //* REF_PICTypes
    const ref_pictypes = JSON.parse(fs.readFileSync('./seeders/data/ref_pictypes.json'));
    const pictypes = ref_pictypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_PICTypes', pictypes);

    //* REF_MetaTemplateLanguages
    const ref_metatemplatelanguages = JSON.parse(fs.readFileSync('./seeders/data/ref_metatemplatelanguages.json'));
    const metatemplatelanguages = ref_metatemplatelanguages.map((element) => ({
      name: element.name,
      value: element.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_MetaTemplateLanguages', metatemplatelanguages);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_ConfigurationCategories', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_QRTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_EventCategories', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_Regions', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_GroupStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_ParticipantTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_IdentityTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_LocationTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_RoomTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_RoomStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_LodgerStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_ChatBotResponseTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_FeedbackTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_FeedbackTargets', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_FeedbackStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_FAQTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_TemplateCategories', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_MetaTemplateCategories', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_TemplateHeaderTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_PICTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_MetaTemplateLanguages', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
