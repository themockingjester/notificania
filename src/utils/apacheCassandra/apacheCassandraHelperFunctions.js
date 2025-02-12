const { exportedDIContainer } = require("../../exportedDiContainer");

class ApacheCassandraHelperFunctions {
  client;
  initClient() {
    this.client = exportedDIContainer.dataWareHouse.apacheCassandra.client;
  }
  async execute({ query, parameters, additionalQueryParams }) {
    const result = await this.client.execute(query, parameters, {
      ...additionalQueryParams,
    });
    return result;
  }
}

const obj = new ApacheCassandraHelperFunctions();
module.exports = obj;
