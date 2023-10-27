/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op, fn } = require('sequelize');
const {
  USR_Feature, USR_RoleFeature, USR_Module, USR_Role,
} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let reportModule = await USR_Module.findOne({ where: { name: 'Report' } });
    if (!reportModule) {
      reportModule = await USR_Module.create({ name: 'Report' });
    }
    // * Transportation Report
    let transportReport = await USR_Feature.findOne({ where: { name: 'View Transportation Report' } });
    if (!transportReport) {
      transportReport = await USR_Feature.create({ name: 'View Transportation Report', moduleId: reportModule?.id });
    }

    // * Event Report
    let eventReport = await USR_Feature.findOne({ where: { name: 'View Event Report' } });
    if (!eventReport) {
      eventReport = await USR_Feature.create({ name: 'View Event Report', moduleId: reportModule?.id });
    }

    // * FnB Report
    let fnbReport = await USR_Feature.findOne({ where: { name: 'View FnB Report' } });
    if (!fnbReport) {
      fnbReport = await USR_Feature.create({ name: 'View FnB Report', moduleId: reportModule?.id });
    }

    // * Accomodation Report
    let accomodationReport = await USR_Feature.findOne({ where: { name: 'View Accomodation Report' } });
    if (!accomodationReport) {
      accomodationReport = await USR_Feature.create({ name: 'View Accomodation Report', moduleId: reportModule?.id });
    }

    // * Participant Report
    let participantReport = await USR_Feature.findOne({ where: { name: 'View Participant Report' } });
    if (!participantReport) {
      participantReport = await USR_Feature.create({ name: 'View Participant Report', moduleId: reportModule?.id });
    }

    const roles = await USR_Role.findAll({
      where: {
        name: {
          [Op.in]: [
            'Super User', 'Admin Pesparani', 'Admin FnB', 'Admin Accomodation', 'Admin Event',
            'Admin Transportation', 'Participant Coordinator', 'PIC Kitchen', 'PIC Transportation',
            'PIC Hotel', 'PIC Location', 'PIC Event',
          ],
        },
      },
      attributes: ['id'],
    });

    const reportsRoleFeature = [];
    roles.forEach((role) => {
      reportsRoleFeature.push({ roleId: role.id, featureId: transportReport.id });
      reportsRoleFeature.push({ roleId: role.id, featureId: eventReport.id });
      reportsRoleFeature.push({ roleId: role.id, featureId: participantReport.id });
      reportsRoleFeature.push({ roleId: role.id, featureId: accomodationReport.id });
      reportsRoleFeature.push({ roleId: role.id, featureId: fnbReport.id });
    });

    await USR_RoleFeature.bulkCreate(reportsRoleFeature);
  },

  async down(queryInterface, Sequelize) {
    const transportReport = await USR_Feature.findOne({ where: { name: 'View Transportation Report' } });
    const eventReport = await USR_Feature.findOne({ where: { name: 'View Event Report' } });
    const fnbReport = await USR_Feature.findOne({ where: { name: 'View FnB Report' } });
    const accomodationReport = await USR_Feature.findOne({ where: { name: 'View Accomodation Report' } });
    const participantReport = await USR_Feature.findOne({ where: { name: 'View Participant Report' } });

    if (transportReport) {
      await USR_RoleFeature.destroy({ where: { featureId: transportReport.id } });
      await transportReport.destroy();
    }
    if (eventReport) {
      await USR_RoleFeature.destroy({ where: { featureId: eventReport.id } });
      await eventReport.destroy();
    }
    if (fnbReport) {
      await USR_RoleFeature.destroy({ where: { featureId: fnbReport.id } });
      await fnbReport.destroy();
    }
    if (accomodationReport) {
      await USR_RoleFeature.destroy({ where: { featureId: accomodationReport.id } });
      await accomodationReport.destroy();
    }
    if (participantReport) {
      await USR_RoleFeature.destroy({ where: { featureId: participantReport.id } });
      await participantReport.destroy();
    }

    await USR_Module.destroy({ where: { name: 'Report' } });
  },
};
