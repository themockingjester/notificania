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

    ServiceType.associate = function (models) {
        ServiceType.hasMany(models.service_config, {
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
