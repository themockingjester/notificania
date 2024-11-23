class BaseRepository {
    currModel = null
    setModel(providedDBModel) {
        this.currModel = providedDBModel
    }
    create = function ({ data, options }) {
        return this.currModel.create(data, { ...options });

    };

    bulkCreate = function ({ dataArray, options }) {
        return this.currModel.bulkCreate(dataArray, { ...options });
    };

    findOne = function ({ whereClause }) {

        return this.currModel.findOne({
            where: whereClause,
        });
    };

    findAll = function ({ whereClause }) {
        return this.currModel.findAll({
            where: whereClause,
        });

    };

    update = function ({ data, whereClause, options }) {
        return this.currModel.update(data, {
            where: whereClause,
            ...options,
        });

    };
    deactivate = function ({ whereClause, options }) {
        return this.currModel.update(
            {
                record_status: 0,
                deactivated_at: new Date(),
            },
            {
                where: whereClause,
                ...options,
            }
        );

    };
}


module.exports = BaseRepository