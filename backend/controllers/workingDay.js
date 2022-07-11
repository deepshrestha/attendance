var db = require("../db").db;

exports.getById = function (req, res) {
  var query = `select id,
                working_day, 
                start_time, 
                end_time, 
                fn_dateTimeFormat(created_at) as created_at
                from working_days
                where id = ${req.params.id}`;
  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAll = function (req, res) {
  var query = `select row_number() over(order by w.id) as sn,
                        w.id,
                        working_day, 
                        start_time, 
                        end_time, 
                        fn_dateTimeFormat(w.created_at) as created_at,
                        e.full_name as created_by
                from working_days w
                join employees e on w.created_by = e.id
                order by w.id`;

  var result = db.queryHandler(query);

  result
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.insertWorkingDayData = function (req, res) {
  //console.log(req.body);
  var query = `insert into working_days (
                    working_day, 
                    start_time,  
                    end_time,
                    created_at, 
                    created_by
                ) 
                values (
                    '${req.body.working_day}', 
                    '${req.body.start_time}', 
                    '${req.body.end_time}', 
                    now(), 
                    '${req.body.created_by}'
                )
                `;

  //console.log(query);
  
  var result = db.queryHandler(query);

  result
    .then((data) => {
      console.log("last insert Id: ", data.insertId);
      res.json(
        {
            success: true,
            message: "Created successfully"
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateWorkingDayData = function (req, res) {
    //console.log(req.body);
    var query = `update working_days 
                   set working_day = '${req.body.working_day}', 
                   start_time = '${req.body.start_time}',  
                   end_time = '${req.body.end_time}',
                   updated_at = now(),
                   updated_by = '${req.body.updated_by}'
                   where id = '${req.body.id}'`;
  
    //console.log(query);
  
    var result = db.queryHandler(query);
  
    result
      .then((data) => {
        //console.log(data);
        res.json({
          success: true,
          message: "Updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
