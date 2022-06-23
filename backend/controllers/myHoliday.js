var db = require('../db').db;

exports.getAll = function(req, res) {
    var query = `select row_number() over(order by h.id) as sn,
                        h.id,
                        h.holiday_name,
                        fn_dateFormat(h.holiday_date) as holiday_date,
                        CASE WHEN DATEDIFF(h.holiday_date, now()) > 0 
                        THEN DATEDIFF(h.holiday_date, now())
                        ELSE '-' 
                        END AS remaining_days,
                        h.category,
                        fn_dateTimeFormat(h.created_at) as created_at,
                        e.full_name as created_by
                from holidays h
                join employees e on h.created_by = e.id
                order by h.id`;

    var result = db.queryHandler(query);

    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })
};

