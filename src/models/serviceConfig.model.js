'use strict';
module.exports = (sequelizeHandler, DataTypes) => {
    const ServiceConfig = sequelizeHandler.define(
        'service_config',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            service_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            key: {
                type: DataTypes.STRING,
            },
            value: {
                type: DataTypes.STRING,
            },
            deactivated_by: {
                type: DataTypes.UUID,
            },
            deactivated_at: {
                type: 'TIMESTAMP',
            },
            created_by: {
                type: DataTypes.UUID,
            },
            updated_by: {
                type: DataTypes.UUID,
            },
            record_status: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
    ServiceConfig.associate = function (models) {
        ServiceConfig.belongsTo(models.service_type, {
            foreignKey: 'service_id',
            sourceKey: 'id',
        });
    };
    return ServiceConfig;
};
