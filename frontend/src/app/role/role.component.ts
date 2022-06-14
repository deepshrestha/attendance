import { Component, Inject, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { formValidator } from "./../helpers/form-validator";
import { RoleService } from "./role.service";
import * as $ from "jquery";

@Component({
    selector: "app-role",
    template: require("./role.component.html")
})

export class RolesComponent implements OnInit {

    service: RoleService;
    constructor(@Inject(RoleService) service: RoleService) {
        this.service = service;
    }

    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    roles: any = {};

    roleOptions: any[] = [];

    tableHeaders = {
        sn: "#",
        role_name: "Role Name",
        parent_role: "Parent Role",
        action: "Action",
        searchFilter: ["role_name", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 2,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        role_id: '',
        role_name: '',
        parent_id: '',
        errors: {
            full_name: '',
            role_name: '',
            // parent_id: ''
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
        this.roles = {};
    }

    clearForm() {
        this.initialState = {
            ...this.initialState,
            role_name: '',
            parent_id: '',
            errors: {
                full_name: '',
                role_name: '',
                // parent_id: ''
            }
        }
    }

    saveInfo(event: any, obj: any) {
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
        //console.log(event.target.elements['shift_id']);
        let formObject = {
            id: event.target.elements['role_id'].value,
            role_name: event.target.elements['role_name'].value,
            parent_id: event.target.elements['parent_id'].value,
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            console.log("fields", formObject)
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
        this.subscribeData = this.service.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        this.roles = data;
                        this.initialState = {
                            ...this.initialState,
                            role_id: data.id,
                            role_name: data.role_name,
                            parent_id: data.parent_id,
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
        this.service.getRoleData().subscribe(
            data => {
                this.roleOptions = data;
            }
        );
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}