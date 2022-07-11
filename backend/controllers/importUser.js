const db = require('../db').db;

exports.postUserData = function(req, res) {
    console.log(req.body);

    var query = `insert into employees (
        shift_id, 
        department_id, 
        role_id, 
        designation_id,
        full_name,
        agreement_type,
        created_at, 
        created_by
        ) 
        values (
        '1', 
        '1',
        '1',
        '1',
        '${req.body["Name"]}',
        'None',
        now(),
        '1'
        )`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(
            {
                success: true,
                message: "File uploaded successfully"
            }
        );
    })
    .catch(err => {
        console.log(err)
    })
    
};