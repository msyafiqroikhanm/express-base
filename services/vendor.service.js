/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const { TPT_Vendor, USR_PIC, USR_User, PAR_Participant } = require('../models');

const selectAllVendors = async (where) => {
  const data = await TPT_Vendor.findAll({
    where: where.picId ? { id: { [Op.in]: where.vendors } } : null,
  });
  console.log(JSON.stringify(data, null, 2));

  await Promise.all(
    data.map(async (vendor) => {
      let pic = null;
      if (vendor.picId) {
        pic = await USR_PIC.findOne({
          where: { id: vendor.picId },
          attributes: ['id', 'userId', 'typeId'],
          include: {
            model: USR_User,
            as: 'user',
            attributes: ['id'],
            include: {
              model: PAR_Participant,
              as: 'participant',
              attributes: ['name', 'phoneNbr', 'email'],
            },
          },
        });
      }

      vendor.dataValues.pic = pic || null;
    }),
  );

  return {
    success: true,
    message: 'Successfully Getting All Vendor',
    content: data,
  };
};

const selectVendor = async (id, where) => {
  if (where.picId) {
    if (!where.vendors.includes(Number(id))) {
      // check if user can have access to related vendor detail
      return {
        success: false,
        code: 404,
        message: ['Vendor Data Not Found'],
      };
    }
  }
  const vendorInstance = await TPT_Vendor.findByPk(id);
  if (!vendorInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vendor Data Not Found'],
    };
  }

  const pic = await USR_PIC.findOne({
    where: { id: vendorInstance.picId },
    attributes: ['id', 'userId', 'typeId'],
    include: {
      model: USR_User,
      as: 'user',
      attributes: ['id', 'username'],
      include: {
        model: PAR_Participant,
        as: 'participant',
        attributes: ['name', 'phoneNbr', 'email'],
      },
    },
  });

  vendorInstance.dataValues.pic = pic || null;

  return {
    success: true,
    message: 'Successfully Getting Vendor',
    content: vendorInstance,
  };
};

const validateVendorInputs = async (form, id) => {
  const invalid400 = [];
  const invalid404 = [];

  const picInstance = await USR_PIC.findOne({
    where: { id: form.picId },
    attributes: ['id', 'typeId'],
  });
  if (!picInstance) {
    invalid404.push('PIC Data Not Found');
  }

  // check name duplication, phone, and email
  const duplicateName = await TPT_Vendor.findOne({
    where: id ? { id: { [Op.ne]: id }, name: form.name } : { name: form.name },
  });
  if (duplicateName) {
    invalid400.push('Vendor Name Already Taken / Exist');
  }

  const duplicatePhone = await TPT_Vendor.findOne({
    where: id ? { id: { [Op.ne]: id }, phoneNbr: form.phoneNbr } : { phoneNbr: form.phoneNbr },
  });
  if (duplicatePhone) {
    invalid400.push('Vendor Phone Number Already Taken / Exist');
  }

  let email = form.email;
  if (!form.email && id) {
    const vendorInstance = await TPT_Vendor.findOne({ where: { id } });
    email = vendorInstance.email;
  }

  //! disable checking duplicate email
  // const duplicateEmail = await TPT_Vendor.findOne({
  //   where: id ? { id: { [Op.ne]: id }, email: form.email } : { email: form.email },
  // });
  // if (duplicateEmail) {
  //   invalid400.push('Vendor Email Already Taken / Exist');
  // }

  // check if pic is pic transportation
  if (picInstance.typeId !== 4) {
    invalid400.push('PIC For Transportation Must Be Type PIC Transportation');
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
    form: {
      pic: picInstance,
      name: form.name,
      address: form.address,
      phoneNbr: form.phoneNbr,
      email,
    },
  };
};

const createVendor = async (form) => {
  const vendorInstance = await TPT_Vendor.create({
    picId: form.pic?.id,
    name: form.name,
    address: form.address,
    phoneNbr: form.phoneNbr,
    email: form.email,
  });

  return {
    success: true,
    message: 'Vendor Successfully Created',
    content: vendorInstance,
  };
};

const updateVendor = async (form, id) => {
  const vendorInstance = await TPT_Vendor.findByPk(id);
  if (!vendorInstance) {
    return {
      success: false,
      code: 404,
      message: 'Vendor Data Not Found',
    };
  }

  vendorInstance.picId = form.pic?.id;
  vendorInstance.name = form.name;
  vendorInstance.address = form.address;
  vendorInstance.phoneNbr = form.phoneNbr;
  vendorInstance.email = form.email;
  await vendorInstance.save();

  return {
    success: true,
    message: 'Vendor Successfully Updated',
    content: vendorInstance,
  };
};

const deleteVendor = async (id) => {
  const vendorInstance = await TPT_Vendor.findByPk(id);
  if (!vendorInstance) {
    return {
      success: false,
      code: 404,
      message: 'Vendor Data Not Found',
    };
  }

  const { name } = vendorInstance.dataValues;

  await vendorInstance.destroy();

  return {
    success: true,
    message: 'Vendor Successfully Deleted',
    content: `Vendor ${name} Successfully Deleted`,
  };
};

module.exports = {
  validateVendorInputs,
  selectAllVendors,
  selectVendor,
  createVendor,
  updateVendor,
  deleteVendor,
};
