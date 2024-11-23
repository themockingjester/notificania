const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const models = {};
    const modelsPath = path.join(__dirname);

    // Dynamically import all model files
    fs.readdirSync(modelsPath)
        .filter((file) => file !== 'index.js' && file.endsWith('.js'))
        .forEach((file) => {
            const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
            models[model.name] = model;
        });

    // Set up associations if they exist
    Object.keys(models).forEach((modelName) => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
    });

    return models;
};
