import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { formatDate } from "@angular/common";
import { Subscription } from "rxjs";
import { formValidator } from "../../helpers/form-validator";
import { LeaveRequestService } from './leave-request.service';
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { LeaveMasterService } from "../leave-master/leave-master.service";
import { Notification } from "./../../services/notification/notification.service";
import * as $ from "jquery";
import { LeaveStatusService } from "../leave-status/leave-status.service";

@Component({
    selector: 'app-leave-request',
    template: require('./leave-request.component.html'),
    providers: [LeaveRequestService]
})
export class LeaveRequestComponent implements OnInit, OnDestroy {

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

    leaveRequestService: LeaveRequestService;
    tokenStorageService: TokenStorageService;
    leaveMasterService: LeaveMasterService;
    notification: Notification;
    leaveStatusService: LeaveStatusService;

    constructor(
        @Inject(LeaveRequestService) leaveRequestService: LeaveRequestService,
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(LeaveMasterService) leaveMasterService: LeaveMasterService,
        @Inject(Notification) notification: Notification,
        @Inject(LeaveStatusService) leaveStatusService: LeaveStatusService
    ) {
        this.leaveRequestService = leaveRequestService;
        this.tokenStorageService = tokenStorageService;
        this.leaveMasterService = leaveMasterService;
        this.notification = notification;
        this.leaveStatusService = leaveStatusService;
    }

    leave_requests: any = {};
    leaveTypeOptions: any[] = [];
    approversOptions: any[] = [];
    options: any[] = [];
    tableData: any = [];

    tableHeaders = {
        sn: "#",
        leave_type: "Leave Type",
        requested_by: "Requested By",
        start_date: "Start Date",
        end_date: "End Date",
        requested_to: "Requested To",
        requested_at: "Requested Date",
        remarks: "Remarks",
        action_request: "Action",
        searchFilter: ["leave_type", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    initialState = {
        leave_request_id: "",
        leave_master_id: "",
        requested_by: "",
        leave_request_date: "",
        requested_to: "",
        requested_at: "",
        errors: {
            leave_master_id: "",
            requested_by: "",
            leave_request_date: "",
            requested_to: "",
            requested_at: "",
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
        this.leave_requests = {};
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            leave_request_id: "",
            leave_master_id: "",
            requested_by: "",
            leave_request_date: "",
            requested_to: "",
            requested_at: "",
            errors: {
                leave_master_id: "",
                requested_by: "",
                leave_request_date: "",
                requested_to: "",
                requested_at: "",
            }
        }
    }

    editInfo(modalEvent) {
        let { event } = modalEvent;
        let requestedDateRange = event.target.elements['leave_request_date'].value;
        let startDateVal = formatDate(requestedDateRange.split('-')[0].trim(), 'yyyy-MM-dd', 'en-US');
        let endDateVal = formatDate(requestedDateRange.split('-')[1].trim(), 'yyyy-MM-dd', 'en-US');
        let requestedToVal = event.target.elements['requested_to']?.value;
        if (!requestedToVal) requestedToVal = 1;
        let formObject = {
            id: event.target.elements['leave_request_id'].value,
            leave_master_id: event.target.elements['leave_master_id'].value,
            start_date: startDateVal,
            end_date: endDateVal,
            requested_to: requestedToVal,
        }
        if (this.onHandleSubmit(event)) {
            //console.log(obj);
            console.log("fields", formObject)
            this.subscribeData = this.leaveRequestService.editDataFromService(formObject)
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

    saveInfo(event: any, obj: any) {
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            obj.value.requested_by = this.tokenStorageService.getUser()["id"];
            let requestedDateRange = obj.value.leave_request_date;
            obj.value.start_date = formatDate(requestedDateRange.split('-')[0].trim(), 'yyyy-MM-dd', 'en-US');
            obj.value.end_date = formatDate(requestedDateRange.split('-')[1].trim(), 'yyyy-MM-dd', 'en-US');
            if (obj.value.requested_to === undefined) obj.value.requested_to = 1;
            this.subscribeData = this.leaveRequestService.postDataFromService(obj.value)
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
            // this.lname.nativeElement.focus();
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
        console.log(id)
        this.subscribeData = this.leaveRequestService.getDataByIdFromService(id)
            .subscribe(
                {
                    next: data => {
                        console.log(data);
                        this.leave_requests = data;
                        this.initialState = {
                            ...this.initialState,
                            leave_request_id: data.id,
                            leave_master_id: data.leave_master_id,
                            requested_by: data.requested_by,
                            leave_request_date: data.start_date + " - " + data.end_date,
                            // start_date: data.start_date,
                            // end_date: data.end_date,
                            requested_to: data.requested_to,
                            requested_at: data.requested_at,
                        }
                        this.initializeFormValidation();
                    },
                    error: err => {
                        console.log(err)
                    }
                }
            )
    }

    onActionRequestClick(requestObj: object) {
        let data = { leave_request_id: requestObj['id'], status_name: requestObj['status_name'], remarks: '' };
        this.leaveRequestService.processLeaveRequestFromService(data).
            subscribe({
                next: data => {
                    this.getAll();
                },
                error: err => {
                    console.log(err)
                },
                complete: () => {
                    console.log("completed!")
                }
            });
    }

    onFilterOptionChange(id) {
        console.log(id)
        this.leaveRequestService.getDataFromService(id).
            subscribe(data => {
                console.log(data)
                this.tableData = data;
                this.paginationConfig = {
                    ...this.paginationConfig,
                    totalRecordsCount: data.length
                }
            })
    }

    getAll(): void {
        this.subscribeData = this.leaveRequestService.getDataFromService(0)
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
        this.leaveMasterService.getLeavesData().subscribe(
            data => {
                this.leaveTypeOptions = data;
            }
        )
        this.leaveRequestService.getSeniorApproversData().subscribe(
            data => {
                this.approversOptions = data;
            }
        )

        this.leaveStatusService.getLeaveStatusData().subscribe(
            data => {
                this.options = data;
                console.log(this.options)
            }
        )
        this.initializeFormValidation();
        this.getAll();
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}