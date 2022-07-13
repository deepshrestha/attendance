import { Component, OnInit, Input, Inject } from "@angular/core";
import { formatDate } from "@angular/common";
import { AttendanceService } from "./../../components/attendance/attendance.service"

@Component({
    selector: "app-attendance",
    template: require("./attendance.component.html")
})
export class AttendanceComponent implements OnInit {

    @Input() isLoggedIn: Boolean;
    attendanceService: AttendanceService;
    constructor(@Inject(AttendanceService) attendanceService: AttendanceService){
        this.attendanceService = attendanceService;

    }

    tableHeaders = {
        id: "#",
        employee_number: "Emp Number",
        name: "Full Name",
        in_time: "Check-In Time",
        out_time: "Check-Out Time",
        total_hours: "Total Hours",
        searchFilter: ["employee_number", "name"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 3,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    ngOnInit(): void {

        // call apiHandler to fetch data

        this.attendanceService.getDataFromService()
        .subscribe(            
            {
                next: data => {
                    this.tableData = data;
                    this.paginationConfig = {
                        ...this.paginationConfig,
                        totalRecordsCount: data.length
                    }
                },
                error: err => {
                    console.log(err)
                },
                complete: () => {
                    console.log("completed!")
                }
            }
        )

        /* this.tableData.push(
            {
                id: 1,
                employee_number: 908,
                name: "Deep Shrestha",
                in_time: "09:45 AM", // 09 * 60 + 45 = 585
                out_time: "06:15 PM", // 18 * 60 + 15 = 1095
                total_hours: "08:30", // 1095 - 585 = 510, hours is calculated by dividing the result from 60 and minutes is calculated by taking modulus from 60
                created_at: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en-US')
            },
        ) */
    }
    
}