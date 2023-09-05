const { Op } = require('sequelize');
const { CSM_ChatbotResponse, REF_ChatBotResponseType } = require('../models');

const validateChatBotQuery = (userQuery) => {
  const parsedQuery = {};

  if (typeof userQuery.active !== 'undefined') {
    parsedQuery.isActive = userQuery.active === 'true';
  }

  if (userQuery.responseTypeId) {
    parsedQuery.responseTypeId = Number(userQuery.responseTypeId);
  }

  return parsedQuery;
};

const selectAllChatBotResponse = async (query) => {
  const data = await CSM_ChatbotResponse.findAll({
    where: query,
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      attributes: ['name'],
    },
  });

  data.forEach((response) => {
    response.dataValues.type = response.type.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfull Getting All ChatBot Response',
    content: data,
  };
};

const selectChatbotResponse = async (id) => {
  // check chatbot response id validity
  const responseInstance = await CSM_ChatbotResponse.findByPk(id, {
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      attributes: ['name'],
    },
  });
  if (!responseInstance) {
    return {
      success: false,
      code: 404,
      message: 'Chatbot Response Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Chatbot Reponse',
    content: responseInstance,
  };
};

const validateChatbotResponseInputs = async (form) => {
  // check chatbot response type id validity
  const typeInstance = await REF_ChatBotResponseType.findByPk(
    form.responseTypeId,
  );
  if (!typeInstance) {
    return {
      isValid: false,
      code: 404,
      message: 'Chatbot Response Type Data Not Found',
    };
  }

  if (form.message?.length > 4000) {
    return {
      isValid: false,
      code: 400,
      message: 'Message data exceeds the maximum size limit of 4000 characters',
    };
  }

  return {
    isValid: true,
    form: {
      responseType: typeInstance,
      message: form.message,
    },
  };
};

const createChatbotResponse = async (form) => {
  const { responseType, message } = form;

  const responseInstance = await CSM_ChatbotResponse.create({
    responseTypeId: responseType.id,
    message,
  });

  return {
    success: true,
    message: 'Chatbot Response Successfully Created',
    content: responseInstance,
  };
};

const activateChatbotResponse = async (id) => {
  // check chatbot response id validity
  const responseInstance = await CSM_ChatbotResponse.findByPk(id);
  if (!responseInstance) {
    return {
      success: false,
      code: 404,
      message: 'Chatbot Response Data Not Found',
    };
  }

  // change status to active
  responseInstance.isActive = true;
  await responseInstance.save();

  // change all other chatbot response to false
  await CSM_ChatbotResponse.update(
    { isActive: false },
    {
      where: {
        isActive: true,
        responseTypeId: responseInstance.responseTypeId,
        id: { [Op.ne]: responseInstance.id },
      },
    },
  );

  return {
    success: true,
    message: 'Chatbot Response Successfully Activated',
    content: responseInstance,
  };
};

const updateChatbotResponse = async (form, id) => {
  const { responseType, message } = form;

  // check chatbot response id validity
  const responseInstance = await CSM_ChatbotResponse.findByPk(id);
  if (!responseInstance) {
    return {
      success: false,
      code: 404,
      message: 'Chatbot Response Data Not Found',
    };
  }

  responseInstance.responseTypeId = responseType.id;
  responseInstance.message = message;
  await responseInstance.save();

  return {
    success: true,
    message: 'Chatbot Response Successfully Updated',
    content: responseInstance,
  };
};

const deleteChatbotResponse = async (id) => {
  // check chatbot response id validity
  const responseInstance = await CSM_ChatbotResponse.findByPk(id);
  if (!responseInstance) {
    return {
      success: false,
      code: 404,
      message: 'Chatbot Response Data Not Found',
    };
  }

  const { name } = responseInstance.dataValues;

  await responseInstance.destroy();

  return {
    success: true,
    message: 'Chatbot Response Successfully Deleted',
    content: `Chatbot Response ${name} Successfully Deleted`,
  };
};

module.exports = {
  validateChatBotQuery,
  validateChatbotResponseInputs,
  selectAllChatBotResponse,
  selectChatbotResponse,
  createChatbotResponse,
  activateChatbotResponse,
  updateChatbotResponse,
  deleteChatbotResponse,
};
