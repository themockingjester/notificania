'use strict';
module.exports = (sequelizeHandler, DataTypes) => {
    const ServiceType = sequelizeHandler.define(
        'service_type',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            service_name: {
                type: DataTypes.STRING,
                unique: true,
            },

            deactivatedBy: {
                type: DataTypes.UUID,
            },
            deactivatedAt: {
                type: 'TIMESTAMP',
            },
            createdBy: {
                type: DataTypes.UUID,
            },
            updatedBy: {
                type: DataTypes.UUID,
            },
            recordStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );

    ServiceType.associate = function (models) {
        ServiceType.belongsTo(models.service_config, {
            sourceKey: 'id',
            foreignKey: 'service_id',
        });
        ServiceType.hasMany(models.notification_event, {
            sourceKey: 'id',
            foreignKey: 'service_id',
        });
    };
    return ServiceType;
};
