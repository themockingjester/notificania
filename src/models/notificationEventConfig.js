'use strict';
module.exports = (sequelizeHandler, DataTypes) => {
    const NotificationEventConfig = sequelizeHandler.define(
        'notification_event_config',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            event_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
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
            indexes: [
                {
                    unique: true,
                    fields: ['event_id', 'key'],
                },
            ],
        }
    );
    NotificationEventConfig.associate = function (models) {
        NotificationEventConfig.belongsTo(models.notification_event, {
            foreignKey: 'event_id',
            sourceKey: 'id',
        });
    };
    return NotificationEventConfig;
};



