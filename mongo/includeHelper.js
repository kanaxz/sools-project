var includesHelper = {
    hasMany: {
        process: (options, pipeline) => {
            var foreignProperty = options.foreignKey + "_id";
            var subPipeline = [{
                $match: {
                    $expr: {
                        $and: [{
                            $eq: ["$" + options.foreignKey+"._id", "$$" + foreignProperty]
                        }]
                    }
                }
            }];
            var lookup = {
                from: options.from,
                let: {
                    [foreignProperty]: "$_id"
                },
                as: options.as,
                pipeline: subPipeline,
            }
            pipeline.push({
                $lookup: lookup
            });

            return lookup;
        }
    },
    hasOne: {
        process: (options, pipeline) => {
            var foreignKey = options.foreignProperty + "_id";
            var subPipeline = [{
                $match: {
                    $expr: {
                        $and: {
                            $eq: ["$_id", "$$" + foreignKey]
                        }
                    }
                }
            }];
            pipeline.push({
                $lookup: {
                    from: options.from,
                    let: {
                        [foreignKey]: "$" +  options.foreignProperty +"._id"
                    },
                    as: options.as,
                    pipeline: subPipeline,
                }
            }, {
                $addFields: {
                    [options.as]: {
                        $arrayElemAt: ["$" + options.as, 0]
                    }
                }
            });
        }
    }
}


module.exports = includesHelper;