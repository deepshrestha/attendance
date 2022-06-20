import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { formValidator } from "./../../helpers/form-validator";
import { LeaveMasterService } from './leave-master.service';
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { Notification } from "./../../services/notification/notification.service";
import * as $ from "jquery";

@Component({
    selector: 'app-leave-master',
    template: require('./leave-master.component.html'),
    providers: [LeaveMasterService]
})
export class LeaveMasterComponent implements OnInit, OnDestroy {
    
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

    leaveMasterService: LeaveMasterService;
    tokenStorageService: TokenStorageService;
    notification: Notification;
    constructor(
        @Inject(LeaveMasterService) leaveMasterService: LeaveMasterService, 
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(Notification) notification: Notification
    ){
        this.leaveMasterService = leaveMasterService;
        this.tokenStorageService = tokenStorageService;
        this.notification = notification;
    }

    leaves: any = {};

    tableHeaders = {
        sn: "#",
        name: "Leave Name",
        leave_days: "Leave Days",
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
        leave_id: "",
        name: "",
        leave_days: "",
        errors: {
            name: "",
            leave_days: "",
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
        this.leaves = {};
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            name: '',
            leave_days: '',
            errors: {
                name: '',
                leave_days: '',
            }
        }
    }
    editInfo(modalEvent) {
        let { event } = modalEvent;
        let formObject = {
            id: event.target.elements['leave_id'].value,
            name: event.target.elements['name'].value
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            console.log("fields", formObject)
            this.subscribeData = this.leaveMasterService.editDataFromService(formObject)
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
            this.subscribeData = this.leaveMasterService.postDataFromService(obj.value)
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
        this.subscribeData = this.leaveMasterService.getDataByIdFromService(id)
        .subscribe(            
            {
                next: data => {
                    console.log(data);
                    this.leaves = data;
                    this.initialState = {
                        ...this.initialState,
                        leave_id: data.id,
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
        this.subscribeData = this.leaveMasterService.getDataFromService()
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