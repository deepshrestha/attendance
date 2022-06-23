import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { MyHolidayService } from "./my-holiday.service";

@Component({
    selector: 'app-my-holiday',
    template: require('./my-holiday.component.html'),
    providers: [MyHolidayService]
})
export class MyHolidayComponent implements OnInit, OnDestroy {

    showTable: boolean = true;
    showAddForm: boolean = false;
    // fields: any = {};
    // errors: any = {};
    // onHandleSubmit: any;
    // onHandleChange: any;
    // onHandleBlur: any;
    subscribeData: Subscription;

    myHolidayService: MyHolidayService;
    constructor(
        @Inject(MyHolidayService) myHolidayService: MyHolidayService,
    ) {
        this.myHolidayService = myHolidayService;
    }

    holidays: any = {};

    tableHeaders = {
        sn: "#",
        name: "Holiday Name",
        holiday_date: "Date",
        remaining_days: "Remaining Days",
        // action: "Action",
        searchFilter: ["name", "remaining_days"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    // initialState = {
    //     holiday_id: "",
    //     name: "",
    //     holiday_date: "",
    //     remaining_days: "",
    //     errors: {
    //         name: "",
    //         holiday_date: "",
    //         remaining_days: ""
    //     }
    // };

    // initializeFormValidation() {
    //     const { onHandleChange, onHandleSubmit, onHandleBlur, fields } = formValidator(this.initialState);

    //     this.onHandleSubmit = onHandleSubmit;
    //     this.onHandleBlur = onHandleBlur;
    //     this.onHandleChange = onHandleChange;
    //     this.fields = fields;
    //     this.errors = fields.errors;
    // }

    //RxBneS%5wH6M

    // showForm() {
    //     this.showTable = false;
    //     this.showAddForm = true;
    //     this.holidays = {};
    // }

    // reInitializeState() {
    //     this.initialState = {
    //         ...this.initialState,
    //         name: "",
    //         holiday_date: "",
    //         remaining_days: "",
    //         errors: {
    //             name: "",
    //             holiday_date: "",
    //             remaining_days: ""
    //         }
    //     }
    // }
    // editInfo(modalEvent) {
    //     let { event } = modalEvent;
    //     let formObject = {
    //         id: event.target.elements['holiday_id'].value,
    //         name: event.target.elements['name'].value,
    //         holiday_date: event.target.elements['holiday_date'].value,
    //         remaining_days: event.target.elements['remaining_days'].value
    //     }
    //     if (this.onHandleSubmit(event)) {
    //         //console.log(obj);
    //         console.log("fields", formObject)
    //         this.subscribeData = this.myHolidayService.editDataFromService(formObject)
    //             .subscribe(
    //                 {
    //                     next: data => {
    //                         //console.log(data);
    //                         if (data.success) {
    //                             this.notification.showMessage("success", data.message);
    //                             $('#showModal').modal('hide');
    //                             this.getAll();
    //                         }
    //                     },
    //                     error: err => {
    //                         console.log(err)
    //                     }
    //                 }
    //             )
    //     }
    // }

    // saveInfo(event: any, obj: any) {
    //     event.preventDefault();
    //     if (this.onHandleSubmit(event)) {
    //         obj.value.created_by = this.tokenStorageService.getUser()["id"];
    //         this.subscribeData = this.myHolidayService.postDataFromService(obj.value)
    //             .subscribe(
    //                 {
    //                     next: data => {
    //                         this.reInitializeState();
    //                         this.initializeFormValidation();
    //                     },
    //                     error: err => {
    //                         console.log(err)
    //                     }
    //                 }
    //             )
    //         obj.resetForm();
    //     }
    // }

    // onCancelModal() {
    //     this.showTable = true;
    //     this.showAddForm = false;
    //     this.reInitializeState();
    //     this.initializeFormValidation();
    //     this.getAll();
    // }

    // onDisplayModalData(id) {
    //     console.log(id)
    //     this.subscribeData = this.myHolidayService.getDataByIdFromService(id)
    //         .subscribe(
    //             {
    //                 next: data => {
    //                     console.log(data);
    //                     this.holidays = data;
    //                     this.initialState = {
    //                         ...this.initialState,
    //                         name: data.name,
    //                         holiday_date: data.holiday_date,
    //                         remaining_days: data.remaining_days
    //                     }
    //                     this.initializeFormValidation();
    //                 },
    //                 error: err => {
    //                     console.log(err)
    //                 }
    //             }
    //         )
    // }

    getAll(): void {
        this.subscribeData = this.myHolidayService.getDataFromService()
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
    }

    ngOnInit(): void {
        // this.initializeFormValidation();
        this.getAll();
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}