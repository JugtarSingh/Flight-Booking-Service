const { StatusCodes } = require("http-status-codes");
const { logger } = require("../config");
const AppError = require("../utils/errors/app-error");
class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const response = await this.model.create(data);
      return response;
    } catch (error) {
      logger.error("Error creating resource:", error);
      throw new AppError("Error creating resource", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async destroy(data) {
    const response = await this.model.destroy({
      where: {
        id: data,
      },
    });
    if(!response){
      throw new AppError('unable to find the resourse',StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async get(data) {
    const response = await this.model.findByPk(data);
    if(!response){
      throw new AppError('unable to find the resourse',StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async getAll(data) {
    const response = await this.model.findAll();
    return response;
  }

  async update(id,data) {
    // data -> {col: val ,......}

    const response = await this.model.update(data, {
      where: {
        id: id,
      },
    });
    if(!response[0]){
      throw new AppError('Unable to find the resourse',StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

module.exports = CrudRepository;