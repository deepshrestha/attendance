import { Component, Inject, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ShiftService } from "../shift/shift.service";
import { formValidator } from "./../../helpers/form-validator";
import { EmployeeService } from "./employee.service";
import { RoleService } from "../role/role.service";
import { DesignationService } from "../designation/designation.service";
import { DepartmentService } from "../department/department.service";
import { Notification } from "./../../services/notification/notification.service";
import * as $ from "jquery";

@Component({
    selector: "app-employees",
    template: require("./employees.component.html")
})

export class EmployeesComponent implements OnInit {

    service: EmployeeService;
    shiftService: ShiftService;
    roleService: RoleService;
    designationService: DesignationService;
    notification: Notification;
    departmentService: DepartmentService;
    constructor(
        @Inject(EmployeeService) service: EmployeeService, 
        @Inject(ShiftService) shiftService: ShiftService,
        @Inject(RoleService) roleService: RoleService,
        @Inject(DesignationService) designationService: DesignationService,
        @Inject(DepartmentService) departmentService: DepartmentService,
        @Inject(Notification) notification: Notification
    ) {
        this.service = service;
        this.shiftService = shiftService;
        this.roleService = roleService;
        this.designationService = designationService;
        this.departmentService = departmentService;
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

    employees: any = {};
    shiftOptions: any[] = [];
    roleOptions: any[] = [];
    designationOptions: any[] = [];
    departmentOptions: any[] = [];
    agreementOptions: any[] = [
        { id: 'Contract', value: 'Contract' },
        { id: 'Probation', value: 'Probation' },
        { id: 'Temporary', value: 'Temporary' },
        { id: 'Permanent', value: 'Permanent' },
    ];

    tableHeaders = {
        sn: "#",
        full_name: "Full Name",
        email_id: "Email Address",
        address: "Address",
        contact_no: "Contact No",
        dob: "Date of Birth",
        shift_name: "Shift",
        role_name: "Role",
        department_name: "Department",
        action: "Action",
        searchFilter: ["full_name", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        employee_id: '',
        full_name: '',
        email_id: '',
        address: '',
        contact_no: '',
        dob: '',
        shift_id: '',
        department_id: '',
        role_id: '',
        designation_id: '',
        join_date: '',
        agreement_type: '',
        errors: {
            full_name: '',
            email_id: '',
            address: '',
            contact_no: '',
            dob: '',
            shift_id: '',
            department_id: '',
            role_id: '',
            designation_id: '',
            join_date: '',
            agreement_type: '',
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
        this.employees = {};
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            full_name: '',
            email_id: '',
            address: '',
            contact_no: '',
            dob: '',
            shift_id: '',
            department_id: '',
            role_id: '',
            designation_id: '',
            join_date: '',
            agreement_type: '',
            errors: {
                full_name: '',
                email_id: '',
                address: '',
                contact_no: '',
                dob: '',
                shift_id: '',
                department_id: '',
                role_id: '',
                designation_id: '',
                join_date: '',
                agreement_type: '',
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
            id: event.target.elements['employee_id'].value,
            address: event.target.elements['address'].value,
            contact_no: event.target.elements['contact_no'].value,
            dob: event.target.elements['dob'].value,
            email_id: event.target.elements['email_id'].value,
            full_name: event.target.elements['full_name'].value,
            shift_id: event.target.elements['shift_id'].value,
            role_id: event.target.elements['role_id'].value,
            designation_id: event.target.elements['designation_id'].value,
            department_id: event.target.elements['department_id'].value,
            join_date: event.target.elements['join_date'].value,
            agreement_type: event.target.elements['agreement_type'].value,
        }
        if (this.onHandleSubmit(event)) {
            this.subscribeData = this.service.editDataFromService(formObject)
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
        this.subscribeData = this.service.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        this.employees = data;
                        this.initialState = {
                            ...this.initialState,
                            employee_id: data.id,
                            full_name: data.full_name,
                            email_id: data.email_id,
                            address: data.address,
                            contact_no: data.contact_no,
                            dob: data.dob,
                            shift_id: data.shift_id,
                            role_id: data.role_id,
                            designation_id: data.designation_id,
                            department_id: data.department_id,
                            join_date: data.join_date,
                            agreement_type: data.agreement_type,
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
        this.shiftService.getShiftData().subscribe(
            data => {
                this.shiftOptions = data;
            }
        );
        this.roleService.getRoleData().subscribe(
            data => {
                this.roleOptions = data;
            }
        );
        this.designationService.getDesignationData().subscribe(
            data => {
                this.designationOptions = data;
            }
        );
        this.departmentService.getDepartmentData().subscribe(
            data => {
                this.departmentOptions = data;
            }
        );

        /* this.shiftService.getDataFromService().subscribe(
            {
                next: data => {
                    // this.shiftOptions = data;
                    console.log(data)
                    data.forEach(element => {
                        this.shiftOptions = [...this.shiftOptions, { id: element.id, value: element.shift_name }]
                    });
                },
                error: err => {
                    console.log(err)
                },
                complete: () => {
                    console.log("completed!")
                }
            }
        ); */
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}