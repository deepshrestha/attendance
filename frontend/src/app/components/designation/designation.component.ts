import { Component, Inject, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { formValidator } from "./../../helpers/form-validator";
import { DesignationService } from "./designation.service";
import { Notification } from "./../../services/notification/notification.service";
import * as $ from "jquery";

@Component({
    selector: "app-designation",
    template: require("./designation.component.html")
})

export class DesignationComponent implements OnInit {

    designationService: DesignationService;
    notification: Notification;
    
    constructor(
        @Inject(DesignationService) designationService: DesignationService,
        @Inject(Notification) notification: Notification
    ) {
        this.designationService = designationService;
        this.notification = notification;
    }

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    designations: any = {};

    tableHeaders = {
        sn: "#",
        designation_name: "Designation",
        created_at: "Created At",
        created_by: "Created By",
        action: "Action",
        searchFilter: ["designation_name", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        designation_id: '',
        designation_name: '',
        errors: {
            designation_name: '',
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
        this.designations = {};
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            designation_name: '',
            errors: {
                designation_name: '',
            }
        }
    }

    saveInfo(event: any, obj: any) {
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            this.subscribeData = this.designationService.postDataFromService(obj.value)
                .subscribe(
                    {
                        next: data => {
                            if(data.success) {
                                this.notification.showMessage("success", data.message);
                                this.reInitializeState();
                                this.initializeFormValidation();
                            }
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
            id: event.target.elements['designation_id'].value,
            designation_name: event.target.elements['designation_name'].value,
        }
        if (this.onHandleSubmit(event)) {
            this.subscribeData = this.designationService.editDataFromService(formObject)
                .subscribe(
                    {
                        next: data => {
                            if (data.success) {
                                this.notification.showMessage("success", data.message);
                                $('#showModal').modal('hide');
                                this.reInitializeState();
                                this.initializeFormValidation();
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
        this.subscribeData = this.designationService.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        this.designations = data;
                        this.initialState = {
                            ...this.initialState,
                            designation_id: data.id,
                            designation_name: data.designation_name,
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
        this.subscribeData = this.designationService.getDataFromService()
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