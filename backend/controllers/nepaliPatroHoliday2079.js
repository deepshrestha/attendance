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
        var importantHolidays = jsonData.filter((holiday) => {
          let holidayDetails = JSON.parse(holiday.description);
          return holidayDetails.important_event ==="1";
        });

        const importHolidays = async () => {
          for (let importantHoliday of importantHolidays) {
            let importantHolidayDetails = JSON.parse(importantHoliday.description);
            var query1 = `INSERT INTO holidays(holiday_name, holiday_date, category, created_at, created_by) 
                  values('${importantHolidayDetails["en"]}', 
                  '${importantHoliday.event_date}', '${importantHolidayDetails.category}', now(), 
                  ${req.body.created_by})`;
            await db.queryHandler(query1);
          }
          res.status(200).send({message: "Holidays Import success"});
        };
        importHolidays();
      });
    });
};


