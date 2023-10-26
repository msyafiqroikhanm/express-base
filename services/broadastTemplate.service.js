/* eslint-disable no-param-reassign */
const slug = require('slugify');
const { Op } = require('sequelize');
const {
  CSM_BroadcastTemplate, REF_TemplateCategory, REF_MetaTemplateCategory, REF_TemplateHeaderType,
  REF_MetaTemplateLanguage,
} = require('../models');
const { metaMediaHandler } = require('./whatsapp.integration.service');

const validateTemplateInputs = async (form, file, id) => {
  const invalid400 = [];
  const invalid404 = [];

  // * Template Information Check
  // check if already have more than 350 template
  const templateCount = await CSM_BroadcastTemplate.count({ paranoid: false });
  if (templateCount >= 350) {
    invalid400.push('Cannot create more message template, reaching limit of 350 templates');
  }

  // check name duplication
  if (form.name) {
    const duplicateName = await CSM_BroadcastTemplate.findOne({
      where: id ? { id: { [Op.ne]: id }, name: slug(form.name, '_').toLowerCase() } : { name: slug(form.name, '_').toLowerCase() },
    });
    if (duplicateName) {
      invalid400.push(`Template With Name ${form.name} Already Exist`);
    }
  }

  // * Template Reference Data Validity Check

  // check broadcast category id
  const categoryInstance = await REF_TemplateCategory.findByPk(form.categoryId);
  if (!categoryInstance) {
    invalid404.push('Broadcast Template Category Data Not Found');
  }

  // check header type id
  const headerTypeInstance = await REF_TemplateHeaderType.findByPk(form.headerTypeId);
  if (!headerTypeInstance) {
    invalid404.push('Broadcast Template Header Type Data Not Found');
  }

  // check meta category id (only for create / post)
  let metaCategoryInstance = null;
  if (form.metaCategoryId) {
    metaCategoryInstance = await REF_MetaTemplateCategory.findByPk(form.metaCategoryId);
    if (!metaCategoryInstance) {
      invalid404.push('Broadcast Template Meta Category Data Not Found');
    }
  }

  // check language id (only for create / post)
  let languageInstance = null;
  if (form.languageId) {
    languageInstance = await REF_MetaTemplateLanguage.findByPk(form.languageId);
    if (!languageInstance) {
      invalid404.push('Broadcast Template Language Data Not Found');
    }
  }

  // * Template Component Validity Check
  // validate message
  if (form.message?.length > 1024) {
    invalid400.push('Message data exceeds the maximum character limit of 1024 characters');
  }

  if (Number(form.messageVariableExample?.length) !== Number(form.messageVariableNumber)) {
    invalid400.push('The Amount Of Message Variable Example Should Be Equal With Message Variable Number');
  }

  // validate footer
  if (form.footer && form.footer?.length > 60) {
    invalid400.push('Footer data exceeds the maximum character limit of 60 characters');
  }

  // validate header
  let fileHandler = null;
  if (headerTypeInstance?.name === 'TEXT') {
    if (!form.headerText) {
      invalid400.push('Template With Header Type Text, Required Header Text');
    }
    const regex = /\{\{(\d+)\}\}/;
    const hasVariable = regex.test(form.headerText);
    if (hasVariable && !form.headerVariableExample) {
      invalid400.push('Template With Header Text With Variable, Required Header Text Example');
    }
  } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerTypeInstance?.name)) {
    // validate file for when header is non text type
    if (!file) {
      invalid400.push(`Header with type ${headerTypeInstance?.name} requires a file upload`);
    }

    const mimeType = file.mimetype;

    if (headerTypeInstance.name === 'IMAGE' && !['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
      invalid400.push('Header with type IMAGE requires a JPEG, JPG, or PNG file.');
    }

    if (headerTypeInstance.name === 'VIDEO' && mimeType !== 'video/mp4') {
      invalid400.push('Header with type VIDEO requires an MP4 file.');
    }

    if (headerTypeInstance.name === 'DOCUMENT' && mimeType !== 'application/pdf') {
      invalid400.push('Header with type DOCUMENT requires a PDF file.');
    }
    // create meta media handler
    fileHandler = await metaMediaHandler(file);
  }

  // validate button
  if (form.button?.length > 3) {
    invalid404.push('Button data exceeds the maximum limit of 3 Buttons');
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
    };
  }

  return {
    isValid: true,
    metaForm: {
      name: slug(form.name || '', '_').toLowerCase(),
      header: {
        type: headerTypeInstance?.name,
        text: form.headerText,
        example: ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerTypeInstance.name) ? fileHandler : form.headerVariableExample,
      },
      message: {
        text: form.message,
        variableNum: Number(form.messageVariableNumber),
        example: form.messageVariableExample,
      },
      footer: form.footer,
      button: form.button,
      metaCategory: metaCategoryInstance?.name || null,
      language: languageInstance?.value || null,
    },
    sysForm: {
      category: categoryInstance,
      metaCategory: metaCategoryInstance || null,
      headerType: headerTypeInstance,
      language: languageInstance || null,
      name: slug(form.name || '', '_').toLowerCase(),
      nameAlias: form.nameAlias || form.name,
      message: form.message,
      messageVariableNumber: Number(form.messageVariableNumber),
      messageVariableExample: form.messageVariableExample,
      headerText: form.headerText,
      headerVariableExample: form.headerVariableExample,
      footer: form.footer,
      button: form.button,
    },
  };
};

const formatTemplate = async (form, method) => {
  const {
    name, header, message, footer, button, metaCategory, language,
  } = form;

  const components = [];

  // Validate button rules
  // Check if there is button with more than 1 content
  if (button && button.length > 1) {
    let quick_reply = 0;
    let others = 0;

    // loop trough button to calculate how many button with type quick reply
    // and other (url and phone number)
    button.forEach((data) => {
      if (data.type === 'QUICK_REPLY') {
        quick_reply += 1;
      } else {
        others += 1;
      }
    });

    // Button cannot mix quick reply type with other types
    if (quick_reply > 0 && others > 0) {
      return {
        isValid: false,
        message: 'Button quick replies type cannot be used with others button types',
      };
    }

    // Button other type max 2 content, while quick reply is 3
    if (others > 2) {
      return {
        isValid: false,
        message: 'Max number of button with type others (url, phone number) is 2',
      };
    }
  }
  try {
    // Check and add header components
    if (header) {
      const headerComponent = {
        type: 'HEADER',
        format: header.type,
      };

      if (header.type === 'TEXT') {
        if (header.example) {
          headerComponent.example = { header_text: [header.example] };
        }
        headerComponent.text = header.text;
      } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(header.type)) {
        if (header.example) {
          headerComponent.example = { header_handle: [header.example] };
        }
      }

      components.push(headerComponent);
    }

    // Check and add body components
    if (message.variableNum > 0) {
      components.push({
        type: 'BODY',
        text: message.text,
        example: {
          body_text: [message.example],
        },
      });
    } else {
      components.push({
        type: 'BODY',
        text: message.text,
      });
    }

    // Check and add footer components
    if (footer) {
      components.push({
        type: 'FOOTER',
        text: footer,
      });
    }

    // Check and add button components
    if (button) {
      const buttonComponents = [];
      button.forEach((data) => {
        if (data.type === 'QUICK_REPLY') {
          buttonComponents.push({
            type: data.type,
            text: data.text,
          });
        } else if (data.type === 'URL') {
          if (data.example) {
            buttonComponents.push({
              type: data.type,
              text: data.text,
              url: data.url,
              example: data.example,
            });
          } else {
            buttonComponents.push({
              type: data.type,
              text: data.text,
              url: data.url,
            });
          }
        } else if (data.type === 'PHONE_NUMBER') {
          buttonComponents.push({
            type: data.type,
            text: data.text,
            phone_number: data.phone_number,
          });
        }
      });
      components.push({
        type: 'BUTTONS',
        buttons: buttonComponents,
      });
    }

    if (method === 'create') {
      return {
        isValid: true,
        formatedTemplate: {
          name,
          category: metaCategory,
          allow_category_change: true,
          language,
          components,
        },
      };
    }

    return { isValid: true, formatedTemplate: components };
  } catch (error) {
    return {
      isValid: false,
      message: 'error',
    };
  }
};

const selectAllTemplate = async () => {
  const templates = await CSM_BroadcastTemplate.findAll({
    include: [
      {
        model: REF_TemplateCategory,
        as: 'category',
        attributes: ['name'],
      },
      {
        model: REF_MetaTemplateCategory,
        as: 'metaCategory',
        attributes: ['name'],
      },
      {
        model: REF_TemplateHeaderType,
        as: 'headerType',
        attributes: ['name'],
      },
      {
        model: REF_MetaTemplateLanguage,
        as: 'language',
        attributes: ['name'],
      },
    ],
  });

  templates.forEach((template) => {
    template.dataValues.category = template.category?.dataValues.name || null;
    template.dataValues.metaCategory = template.metaCategory?.dataValues.name || null;
    template.dataValues.headerType = template.headerType?.dataValues.name || null;
    template.dataValues.language = template.language?.dataValues.name || null;
  });

  return {
    success: true,
    message: 'Successfully Getting All Broadcast Template',
    content: templates,
  };
};

const selectTemplate = async (id) => {
  const templateInstance = await CSM_BroadcastTemplate.findOne({
    where: { id },
    include: [
      {
        model: REF_TemplateCategory,
        as: 'category',
        attributes: ['name'],
      },
      {
        model: REF_MetaTemplateCategory,
        as: 'metaCategory',
        attributes: ['name'],
      },
      {
        model: REF_TemplateHeaderType,
        as: 'headerType',
        attributes: ['name'],
      },
      {
        model: REF_MetaTemplateLanguage,
        as: 'language',
        attributes: ['name'],
      },
    ],
  });
  if (!templateInstance) {
    return {
      success: false,
      code: 404,
      message: ['Broadcast Template Data Not Found'],
    };
  }

  templateInstance.dataValues.category = templateInstance.category?.dataValues.name || null;
  templateInstance.dataValues.metaCategory = templateInstance.metaCategory?.dataValues.name || null;
  templateInstance.dataValues.headerType = templateInstance.headerType?.dataValues.name || null;
  templateInstance.dataValues.language = templateInstance.language?.dataValues.name || null;

  return {
    success: true,
    message: 'Successfully Getting Broadcast Template',
    content: templateInstance,
  };
};

const createBroadcastTemplate = async (form) => {
  const templateInstance = await CSM_BroadcastTemplate.create({
    categoryId: form.category.id,
    metaCategoryId: form.metaCategory.id,
    headerTypeId: Number(form.headerType.id),
    languageId: form.language.id,
    metaId: form.metaId,
    metaStatus: form.metaStatus,
    name: form.name,
    nameAlias: form.nameAlias,
    message: form.message,
    messageVariableNumber: form.messageVariableNumber,
    messageVariableExample: form.messageVariableExample,
    headerText: form.headerText,
    headerVariableExample: form.headerVariableExample,
    footer: form.footer,
    button: form.button,
  });

  return {
    success: true,
    message: 'Broadcast Template Successfully Created',
    content: templateInstance,
  };
};

const updateBroadcastTemplate = async (form, id) => {
  const templateInstance = await CSM_BroadcastTemplate.findByPk(id);
  if (!templateInstance) {
    return {
      success: false,
      code: 404,
      message: ['Broadcast Template Data Not Found'],
    };
  }

  templateInstance.categoryId = form.category.id;
  templateInstance.headerTypeId = form.headerType.id;
  templateInstance.metaStatus = form.metaStatus || 'PENDING';
  templateInstance.nameAlias = form.nameAlias;
  templateInstance.message = form.message;
  templateInstance.messageVariableNumber = form.messageVariableNumber;
  templateInstance.messageVariableExample = form.messageVariableExample;
  templateInstance.headerText = form.headerText;
  templateInstance.headerVariableExample = form.headerVariableExample;
  templateInstance.footer = form.footer;
  templateInstance.button = form.button;
  await templateInstance.save();

  return {
    success: true,
    message: 'Broadcast Template Successfully Updated',
    content: templateInstance,
  };
};

const deleteBroadcastTemplate = async (id) => {
  const templateInstance = await CSM_BroadcastTemplate.findByPk(id);
  if (!templateInstance) {
    return {
      success: false,
      code: 404,
      message: ['Broadcast Template Data Not Found'],
    };
  }

  const { name } = templateInstance.dataValues;

  await templateInstance.destroy();

  return {
    success: true,
    message: 'Broadcast Template Successfully Deleted',
    content: `Broadcast Template ${name} Successfully Deleted`,
  };
};

module.exports = {
  validateTemplateInputs,
  formatTemplate,
  selectAllTemplate,
  selectTemplate,
  createBroadcastTemplate,
  updateBroadcastTemplate,
  deleteBroadcastTemplate,
};
