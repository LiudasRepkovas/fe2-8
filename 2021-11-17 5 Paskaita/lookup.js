db.getCollection('pets').aggregate([
    {$lookup: {
        from: 'users',
        localfield: 'user_id',
        foreignField: 'id',
        as: 'user',
    }},
])

db.getCollection('users').aggregate([
    {$lookup: {
        from: 'pets',
        localfield: 'id',
        foreignField: 'user_id',
        as: 'pets',
    }},
])