import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { formValidator } from "./../../helpers/form-validator";
import { LeaveStatusService } from './leave-status.service';
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { Notification } from "./../../services/notification/notification.service";
import * as $ from "jquery";

@Component({
    selector: 'app-leave-status',
    template: require('./leave-status.component.html'),
    providers: [LeaveStatusService]
})
export class LeaveStatusComponent implements OnInit, OnDestroy {
    
    showTable: boolean = true;
    showAddForm: boolean = false;
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleChange: any;
    onHandleBlur: any;
    subscribeData: Subscription;

    @Input() isLoggedIn: Boolean;
    @ViewChild('lname') lname: ElementRef;
    @ViewChild('modalBody') modalBody: ElementRef;

    options: any[] = [
        {id: false, value: 'Option 1'},
        {id: true, value: 'Option 2'}
    ];

    leaveStatusService: LeaveStatusService;
    tokenStorageService: TokenStorageService;
    notification: Notification;
    constructor(
        @Inject(LeaveStatusService) leaveStatusService: LeaveStatusService, 
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(Notification) notification: Notification
    ){
        this.leaveStatusService = leaveStatusService;
        this.tokenStorageService = tokenStorageService;
        this.notification = notification;
    }

    leave_statuses: any = {};

    tableHeaders = {
        sn: "#",
        name: "Leave Status Name",
        created_at: "Created At",
        created_by: "Created By",
        action: "Action",
        searchFilter: ["name", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    tableData: any = [];

    initialState = {
        leave_status_id: "",
        name: "",
        errors: {
            name: "",
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

    showForm(){
        this.showTable = false;
        this.showAddForm = true;
        this.leave_statuses = {};
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            name: '',
            errors: {
                name: ''
            }
        }
    }
    editInfo(modalEvent) {
        let { event } = modalEvent;
        let formObject = {
            id: event.target.elements['leave_status_id'].value,
            name: event.target.elements['name'].value
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            console.log("fields", formObject)
            this.subscribeData = this.leaveStatusService.editDataFromService(formObject)
            .subscribe(
                {
                    next: data => {
                        //console.log(data);
                        if(data.success) {
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

    saveInfo(event: any, obj: any){
        obj.value.created_by = this.tokenStorageService.getUser()["id"];
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            this.subscribeData = this.leaveStatusService.postDataFromService(obj.value)
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
            this.lname.nativeElement.focus();
        }   
    }

    onCancelModal(){
        this.showTable = true;
        this.showAddForm = false;
        this.reInitializeState();
        this.initializeFormValidation();
        this.getAll();
    }

    onDisplayModalData(id){
        console.log(id)
        this.subscribeData = this.leaveStatusService.getDataByIdFromService(id)
        .subscribe(            
            {
                next: data => {
                    console.log(data);
                    this.leave_statuses = data;
                    this.initialState = {
                        ...this.initialState,
                        leave_status_id: data.id,
                        name: data.name
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
        this.subscribeData = this.leaveStatusService.getDataFromService()
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