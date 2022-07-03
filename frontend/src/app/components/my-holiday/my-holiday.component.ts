import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Notification } from "../../services/notification/notification.service";
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { MyHolidayService } from "./my-holiday.service";

@Component({
    selector: 'app-my-holiday',
    template: require('./my-holiday.component.html'),
    providers: [MyHolidayService]
})
export class MyHolidayComponent implements OnInit, OnDestroy {

    showTable: boolean = true;
    showAddForm: boolean = false;
    subscribeData: Subscription;

    myHolidayService: MyHolidayService;
    tokenStorageService: TokenStorageService;
    notification: Notification;
    constructor(
        @Inject(MyHolidayService) myHolidayService: MyHolidayService,
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(Notification) notification: Notification
    ) {
        this.myHolidayService = myHolidayService;
        this.tokenStorageService = tokenStorageService;
        this.notification = notification;
    }

    holidays: any = {};

    tableHeaders = {
        sn: "#",
        holiday_name: "Holiday Name",
        holiday_date: "Date",
        remaining_days: "Remaining Days",
        category: "Category",
        searchFilter: ["holiday_name", "remaining_days"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 10,
        totalRecordsCount: 0,
    }

    tableData: any = [];
    
    importData() {
        let data = { created_by: this.tokenStorageService.getUser()["id"] }
        this.notification.showMessage('info', "Importing holidays. Please wait.")
        this.myHolidayService.importNepaliPatroHolidayDataFromService(data)
            .subscribe(res => {
                if(res.success){
                    this.notification.showMessage('success', res.message)
                    this.getAll();
                }
            })
    }

    getAll(): void {
        this.subscribeData = this.myHolidayService.getDataFromService()
            .subscribe(
                {
                    next: data => {
                        this.tableData = data;
                        this.paginationConfig = {
                            ...this.paginationConfig,
                            currentPage: 1,
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
    }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}