db.getCollection('pets').aggregate([
    {$match: { age: {$gt: 10}}},
    {$group: {
            _id: "$type",
            ageSum: { $sum: "$age"},
            ageAverage: { $avg: "$age"},
            count: {$sum: 1}
    }},
    {$sort: {
            count: -1
       }},
    {$project: {
            _id: 0,
    }}
])


