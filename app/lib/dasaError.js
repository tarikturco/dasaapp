class DasaError extends Error {
  constructor (modelName, message) {
    super(message);

    this.modelName = modelName;
    this.name = this.constructor.name;
  }
}

module.exports = DasaError;