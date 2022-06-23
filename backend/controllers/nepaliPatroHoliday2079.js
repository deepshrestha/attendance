var db = require("../db").db;
const fetch = require("node-fetch");

exports.import = function (req, res) {
  fetch("https://api.nepalipatro.com.np/goverment-holidays/2079", {
    method: "Get",
  })
    .then((res) => res.json())
    .then((jsonData) => {
      var query = `TRUNCATE TABLE holidays`;
      var result = db.queryHandler(query);
      result.then((data) => {
        var mainHolidays = jsonData.filter((holiday) => {
          return holiday.priority === "1";
        });

        const importHolidays = async () => {
          for (let mainHoliday of mainHolidays) {
            var query1 = `INSERT INTO holidays(holiday_name, holiday_date, created_at, created_by) 
                  values('${JSON.parse(mainHoliday.description)["en"]}', 
                  '${mainHoliday.event_date}', now(), 
                  ${req.body.created_by})`;
            await db.queryHandler(query1);
          }
          res.status(200).send({message: "Holidays Import success"});
        };
        importHolidays();
      });
    });
};


