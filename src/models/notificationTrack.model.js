'use strict';
module.exports = (sequelizeHandler, DataTypes) => {
    const NotificationTrack = sequelizeHandler.define(
        'notification_track',
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
            final_response: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            data: {
                type: DataTypes.JSON,
                allowNull: true,
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
    NotificationTrack.associate = function (models) {
        NotificationTrack.belongsTo(models.notification_event, {
            foreignKey: 'event_id',
            sourceKey: 'id',
        });
    };
    return NotificationTrack;
};



