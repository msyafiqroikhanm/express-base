const { CSM_FAQ, REF_FAQType } = require('../models');

const selectAllFAQs = async () => {
  const data = await CSM_FAQ.findAll();

  return {
    success: true,
    message: 'Successfully Getting All FAQ',
    content: data,
  };
};

const selectFAQ = async (id) => {
  // validate faq id
  const faqInstance = await CSM_FAQ.findByPk(id);
  if (!faqInstance) {
    return {
      success: false,
      code: 404,
      message: 'FAQ Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting FAQ',
    content: faqInstance,
  };
};

const validateFAQInputs = async (form) => {
  // check faq type id validity
  const typeinstance = await REF_FAQType.findByPk(form.typeId);
  if (!typeinstance) {
    return {
      isValid: false,
      code: 404,
      message: 'FAQ Type Data Not Found',
    };
  }

  let faqInstance = null;
  if (form.parentFAQId) {
    faqInstance = await CSM_FAQ.findByPk(form.parentFAQId);
    if (!faqInstance) {
      return {
        isValid: false,
        code: 404,
        message: 'Parent FAQ Data Not Found',
      };
    }
    if (faqInstance.message) {
      return {
        isValid: false,
        code: 400,
        message: 'Cannot Use Final FAQ as Parent FAQ',
      };
    }
    if (faqInstance.typeId !== typeinstance.id) {
      return {
        isValid: false,
        code: 400,
        message: 'Different Type From Parent Faq',
      };
    }
  }

  // check if main faq already exist for the type
  if (!faqInstance) {
    const existMainFAQ = await CSM_FAQ.findOne({
      where: {
        typeId: typeinstance.id,
        isMain: true,
      },
    });

    if (existMainFAQ) {
      return {
        isValid: false,
        code: 400,
        message: `FAQ Type ${typeinstance.name} already have main FAQ`,
      };
    }
  }

  if (form.title?.length > 24) {
    return {
      isValid: false,
      code: 400,
      message: 'Title data exceeds the maximum character limit of 24 characters',
    };
  }

  if (form.message?.length > 4000) {
    return {
      isValid: false,
      code: 400,
      message: 'Message data exceeds the maximum character limit of 4000 characters',
    };
  }

  return {
    isValid: true,
    form: {
      parentFaq: faqInstance,
      type: typeinstance,
      isMain: !faqInstance,
      title: form.title,
      message: form.message || null,
    },
  };
};

const createFAQ = async (form) => {
  const {
    parentFaq, type, isMain, title, message,
  } = form;

  const faqInstance = await CSM_FAQ.create({
    parentFaqId: parentFaq?.id || null,
    type: type.id,
    isMain,
    title,
    message,
  });

  return {
    success: true,
    message: 'FAQ Successfully Created',
    content: faqInstance,
  };
};

const updateFAQ = async (form, id) => {
  const {
    parentFaq, type, isMain, title, message,
  } = form;

  // validate faq id
  const faqInstance = await CSM_FAQ.findByPk(id);
  if (!faqInstance) {
    return {
      success: false,
      code: 404,
      message: 'FAQ Data Not Found',
    };
  }

  faqInstance.parentFAQId = parentFaq.id;
  faqInstance.typeId = type.id;
  faqInstance.isMain = isMain;
  faqInstance.title = title;
  faqInstance.message = message;
  await faqInstance.save();

  return {
    success: true,
    message: 'FAQ Successfully Updated',
    content: faqInstance,
  };
};

const deleteFAQ = async (id) => {
  // validate faq id
  const faqInstance = await CSM_FAQ.findByPk(id, {
    include: [
      { model: CSM_FAQ, as: 'parentFAQ' },
      { model: CSM_FAQ, as: 'childFAQs' },
    ],
  });
  if (!faqInstance) {
    return {
      success: false,
      code: 404,
      message: 'FAQ Data Not Found',
    };
  }

  await faqInstance.destroy();
  await CSM_FAQ.update(
    { parentFAQId: null },
    {
      where: {
        parentFAQId: faqInstance.id,
      },
    },
  );

  return {
    success: true,
    message: 'FAQ Successfully Deleted',
    content: 'FAQ Successfully Deleted',
  };
};

module.exports = {
  validateFAQInputs,
  selectAllFAQs,
  selectFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};
