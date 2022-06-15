import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from "@angular/core";
import { formValidator } from "./../../helpers/form-validator";
import { WorkingDayService } from './working-day.service'
import * as $ from "jquery";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-working-day',
    template: require('./working-day.component.html'),
    providers: [WorkingDayService]
})
export class WorkingDayComponent implements OnInit {

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any;
    errors: any;
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    @Input() isLoggedIn: Boolean;
    @ViewChild('wname') wname: ElementRef;

    service: WorkingDayService;
    constructor(@Inject(WorkingDayService) service: WorkingDayService) {
        this.service = service;
    }

    working_days: any = {};

    working_dayOptions: any[] = [
        { id: 'Sunday', value: 'Sunday' },
        { id: 'Monday', value: 'Monday' },
        { id: 'Tuesday', value: 'Tuesday' },
        { id: 'Wednesday', value: 'Wednesday' },
        { id: 'Thursday', value: 'Thursday' },
        { id: 'Friday', value: 'Friday' },
    ];

    tableHeaders = {
        sn: "#",
        working_day: "Working Day",
        start_time: "Start Time",
        end_time: "End Time",
        created_at: "Created At",
        action: "Action",
        searchFilter: ["working_day", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        mode: "I",
        working_day_id: "",
        working_day: "",
        start_time: "",
        end_time: "",
        errors: {
            working_day: "",
            start_time: "",
            end_time: "",
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
        this.working_days = {};
    }

    clearForm() {
        this.initialState = {
            ...this.initialState,
            working_day_id: "",
            working_day: "",
            start_time: "",
            end_time: "",
            errors: {
                working_day: "",
                start_time: "",
                end_time: "",
            }
        }
    }

    saveInfo(event, obj) {
        console.log(obj.value)
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            this.subscribeData = this.service.postDataFromService(obj.value)
                .subscribe(
                    {
                        next: data => {
                            this.clearForm();
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
        let formObject = {
            id: event.target.elements['working_day_id'].value,
            working_day: event.target.elements['working_day'].value,
            start_time: event.target.elements['start_time'].value,
            end_time: event.target.elements['end_time'].value,
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            this.subscribeData = this.service.editDataFromService(formObject)
                .subscribe(
                    {
                        next: data => {
                            console.log(data);
                            if (data.success) {
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
        this.clearForm();
        this.initializeFormValidation();
        this.getAll();
    }

    onDisplayModalData(id) {
        console.log(id)
        this.subscribeData = this.service.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        this.working_days = data;
                        this.initialState = {
                            ...this.initialState,
                            working_day_id: data.id,
                            working_day: data.working_day,
                            start_time: data.start_time,
                            end_time: data.end_time,
                        }
                        this.initializeFormValidation();
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            )
    }

    getAll(): void {
        this.subscribeData = this.service.getDataFromService()
            .subscribe(
                {
                    next: data => {
                        console.log(data)
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
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}