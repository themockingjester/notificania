// This additional file is purposefully created to avoid issues from nodejs cache
const DI_CONTAINER = require("./di-container");

const exportedDIContainer = DI_CONTAINER

module.exports = {
    exportedDIContainer
}