const { TPT_Vendor } = require('../models');

const selectAllVendors = async () => {
  const data = await TPT_Vendor.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Vendor',
    content: data,
  };
};

const selectVendor = async (id) => {
  const vendorInstance = await TPT_Vendor.findByPk(id);
  if (!vendorInstance) {
    return {
      success: false,
      code: 404,
      message: 'Vendor Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Vendor',
    content: vendorInstance,
  };
};

const createVendor = async (form) => {
  const vendorInstance = await TPT_Vendor.create(form);

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
  selectAllVendors,
  selectVendor,
  createVendor,
  updateVendor,
  deleteVendor,
};
