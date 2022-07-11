const ZKLib = require('node-zklib')
const axios = require('axios')

const socketAPI = async () => {

    let zkInstance = new ZKLib('192.168.1.200', 4370, 10000, 4000);
    try {
        // Create socket to machine 
        await zkInstance.createSocket()
        console.log(await zkInstance.getInfo())
    } catch(e) {
        console.warn("Device is not ready!");
        process.exit(0);
    }
    
    const users = await zkInstance.getUsers();
    //console.log(users.data)

    const attendences = await zkInstance.getAttendances();
    //console.log(attendences.data);

    const getRealTimeData = zkInstance.getRealTimeLogs((data)=>{
        // do something when some checkin 
        console.log("data", data);

        axios.post("http://localhost:3000/api/attendance", data)
        .then(response => {
            console.log(response.data)
            zkInstance.clearAttendanceLog()
            .then(() => {
                console.log("Attendance cleared!");
            })
            .catch(err => {
                console.log(err);
            })
            return response
        })
        .catch(err => {
            console.log(err)
        })
    })
    
    //zkInstance.clearAttendanceLog();

    return {
        attendences,
        getRealTimeData,
        users
    }

}

module.exports = socketAPI()