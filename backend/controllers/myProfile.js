var db = require('../db').db;

exports.getProfileById = function(req, res) {
    var query = `select full_name,
                        email_id,
                        fn_dateFormat(dob) as dob,
                        contact_no,
                        address,
                        join_date,
                        agreement_type 
                 from employees 
                 where id = '${req.params.id}'`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

