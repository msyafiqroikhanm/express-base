const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllTemplate,
  selectTemplate,
  validateTemplateInputs,
  formatTemplate,
  createBroadcastTemplate,
  updateBroadcastTemplate,
  deleteBroadcastTemplate,
} = require('../services/broadastTemplate.service');
const {
  registerWhatsappTemplate,
  updateMetaWhatsappTemplate,
  deleteMetaWhatsappTemplate,
} = require('../services/whatsapp.integration.service');

class BroadcastTemplateController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const query = {};
      if (req.query?.metaStatus) {
        query.metaStatus = req.query.metaStatus;
      }

      const data = await selectAllTemplate(query);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectTemplate(req.params.id);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateTemplateInputs(req.body, req.file);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const template = await formatTemplate(inputs.metaForm, 'create');
      if (!template.isValid) {
        return ResponseFormatter.error400(res, 'Bad Request', template.message);
      }

      const registration = await registerWhatsappTemplate(template.formatedTemplate);
      if (!registration.success && registration.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', registration.message);
      }
      if (!registration.success) {
        return ResponseFormatter.InternalServerError(res, registration.message);
      }

      inputs.sysForm.metaId = registration.metaResponse.id;
      inputs.sysForm.metaStatus = registration.metaResponse.status;

      const data = await createBroadcastTemplate(inputs.sysForm);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateTemplateInputs(req.body, req.file, req.params.id);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const template = await formatTemplate(inputs.metaForm, 'update');
      if (!template.isValid) {
        return ResponseFormatter.error400(res, 'Bad Request', template.message);
      }

      const updateResponse = await updateMetaWhatsappTemplate(
        template.formatedTemplate,
        req.params.id,
      );
      if (!updateResponse.success && updateResponse.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', updateResponse.message);
      }
      if (!updateResponse.isValid && updateResponse.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', updateResponse.message);
      }
      if (!updateResponse.success) {
        return ResponseFormatter.InternalServerError(res, updateResponse.message);
      }

      const data = await updateBroadcastTemplate(inputs.sysForm, req.params.id);
      if (!data.success) {
        return ResponseFormatter.InternalServerError(res, data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const meta = await deleteMetaWhatsappTemplate(req.params.id);
      if (!meta.success && meta.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', meta.message);
      }
      if (!meta.success && meta.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', meta.message);
      }
      if (!meta.success) {
        return ResponseFormatter.InternalServerError(res, meta.message);
      }

      const data = await deleteBroadcastTemplate(req.params.id);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BroadcastTemplateController;
