const db = require('../db').db;

exports.getProfileById = function(req, res) {
    var query = `select full_name,
                        email_id,
                        fn_dateFormat(dob) as dob,
                        contact_no,
                        address,
                        photo,
                        fn_dateFormat(join_date) as join_date,
                        agreement_type,
                        d.designation_name as designation 
                 from employees e
                 join designations d on (e.designation_id = d.id)
                 where e.id = '${req.params.id}'`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

exports.postProfileImage = function(req, res) {
    //console.log(req.file);
    if (!req.file) {
        res.json(
            {
                success: false,
                message: "Error occured. Image is not uploaded"
            }
        );
    } else {
        var imgsrc = `${req.protocol}://${req.headers.host}/images/${req.file.filename}`;
        var query = `update employees set photo = '${imgsrc}'  where id = '${req.params.id}'`;

        var result = db.queryHandler(query);

        result.then(data => {
            res.json(
                {
                    success: true,
                    message: "Image uploaded successfully"
                }
            );
        })
        .catch(err => {
            console.log(err)
        })
    }
    
};