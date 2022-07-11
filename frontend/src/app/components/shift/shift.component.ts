import { Component, OnInit, Input, ViewChild, ElementRef, Inject } from "@angular/core";
import { formatDate } from "@angular/common";
import { formValidator } from "./../../helpers/form-validator";
import { ShiftService } from './shift.service'
import { Subscription } from "rxjs";
import { Notification } from "./../../services/notification/notification.service";
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import * as $ from 'jquery';

@Component({
    selector: 'app-shift',
    template: require('./shift.component.html'),
    providers: [ShiftService]
})
export class ShiftComponent implements OnInit {

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any;
    errors: any;
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    @Input() isLoggedIn: Boolean;

    //@ViewChild('name') name: ElementRef;

    service: ShiftService;
    notification: Notification;
    tokenStorageService: TokenStorageService;

    constructor(
        @Inject(ShiftService) service: ShiftService,
        @Inject(Notification) notification: Notification,
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
    ) {
        this.service = service;
        this.notification = notification;
        this.tokenStorageService = tokenStorageService;
    }

    shifts: any = {};
    shiftOptions: any[] = [];
    start_week_dayOptions: any[] = [
        { id: 'None', value: 'None' },
        { id: 'Sunday', value: 'Sunday' },
        { id: 'Monday', value: 'Monday' },
    ];

    tableHeaders = {
        sn: "#",
        shift_name: "Shift Name",
        start_week_day: "Start Week Day",
        allow_overtime: "Allow Overtime",
        start_overtime: "Start Overtime (Hours)",
        created_at: "Created At",
        action: "Action",
        searchFilter: ["shift_name"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        shift_id: "",
        shift_name: "",
        start_week_day: "",
        allow_overtime: "",
        start_overtime: "",
        errors: {
            shift_name: "",
            start_week_day: "",
            allow_overtime: "",
            start_overtime: "",
        }
    };

    initializeFormValidation() {
        const { onHandleChange, onHandleSubmit, onHandleBlur, fields } = formValidator(this.initialState);
        this.onHandleSubmit = onHandleSubmit;
        this.onHandleBlur = onHandleBlur;
        this.onHandleChange = onHandleChange;
        this.fields = fields;
        this.errors = fields.errors;
    }

    showForm() {
        this.showTable = false;
        this.showAddForm = true;
        this.shifts = {};
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            shift_id: "",
            shift_name: "",
            start_week_day: "",
            allow_overtime: "",
            start_overtime: "",
            errors: {
                shift_name: "",
                start_week_day: "",
                allow_overtime: "",
                start_overtime: "",
            }
        }
    }

    saveInfo(event, obj) {
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            obj.value.created_by = this.tokenStorageService.getUser()["id"];
            this.subscribeData = this.service.postDataFromService(obj.value)
                .subscribe(
                    {
                        next: data => {
                            this.reInitializeState();
                            this.initializeFormValidation();
                        },
                        error: err => {
                            console.log(err)
                        }
                    }
                )
            obj.resetForm();
        }
    }

    editInfo(modalEvent) {
        let { event } = modalEvent;
        //console.log(event.target.elements['shift_id']);
        let formObject = {
            id: event.target.elements['shift_id'].value,
            shift_name: event.target.elements['shift_name'].value,
            start_week_day: event.target.elements['start_week_day'].value,
            start_overtime: event.target.elements['start_overtime'].value,
            updated_by: this.tokenStorageService.getUser()["id"]
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            this.subscribeData = this.service.editDataFromService(formObject)
                .subscribe(
                    {
                        next: data => {
                            //console.log(data);
                            if (data.success) {
                                this.notification.showMessage("success", data.message);
                                $('#showModal').modal('hide');
                                this.getAll();
                            }
                        },
                        error: err => {
                            console.log(err)
                        }
                    }
                )
        }
    }
    
    onCancelModal() {
        this.showTable = true;
        this.showAddForm = false;
        this.reInitializeState();
        this.initializeFormValidation();
        this.getAll();
    }

    onDisplayModalData(id) {
        this.subscribeData = this.service.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        this.shifts = data;
                        console.log(this.shifts)
                        this.initialState = {
                            ...this.initialState,
                            shift_id: data.id,
                            shift_name: data.shift_name,
                            start_week_day: data.start_week_day,
                            start_overtime: data.start_overtime,
                        }
                        this.initializeFormValidation();
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            )
    }

    onCheckboxClick({event, id}) {
        this.service.editAllowOvertimeDataFromService({id, allow_overtime: event.target.checked}).subscribe({
            next: data => {
                console.log(data)
            }
        })
    }

    getAll(): void {
        this.subscribeData = this.service.getDataFromService()
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
        this.initializeFormValidation();
        this.getAll();
        this.service.getShiftData().subscribe(
            data => {
                this.shiftOptions = data;
            }
        );
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}