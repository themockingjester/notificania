'use strict';
module.exports = (sequelizeHandler, DataTypes) => {
    const NotificationEvent = sequelizeHandler.define(
        'notification_event',
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
            event_name: {
                type: DataTypes.STRING,
                allowNull: false,
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
    NotificationEvent.associate = function (models) {
        NotificationEvent.belongsTo(models.service_type, {
            foreignKey: 'service_id',
            sourceKey: 'id',
        });
        NotificationEvent.hasMany(models.notification_event_dynamic_data, {
            sourceKey: 'id',
            foreignKey: 'event_id',
        });
    };
    return NotificationEvent;
};
