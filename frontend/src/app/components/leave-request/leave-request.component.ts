import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { LeaveRequestService } from './leave-request.service';
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { Notification } from "./../../services/notification/notification.service";
import { LeaveStatusService } from "../leave-status/leave-status.service";

@Component({
    selector: 'app-leave-request',
    template: require('./leave-request.component.html'),
    providers: [LeaveRequestService]
})
export class LeaveRequestComponent implements OnInit, OnDestroy {
    
    subscribeData: Subscription;
    leaveRequestService: LeaveRequestService;
    tokenStorageService: TokenStorageService;
    notification: Notification;
    leaveStatusService: LeaveStatusService;

    constructor(
        @Inject(LeaveRequestService) leaveRequestService: LeaveRequestService,
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(Notification) notification: Notification,
        @Inject(LeaveStatusService) leaveStatusService: LeaveStatusService
    ) {
        this.leaveRequestService = leaveRequestService;
        this.tokenStorageService = tokenStorageService;
        this.notification = notification;
        this.leaveStatusService = leaveStatusService;
    }
    
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
        action_request: {
            title: 'Action',
            buttons: [
                {
                    status : true,
                    name : 'Approved',
                    class: 'btn btn-success',
                    title: 'Approve',
                },
                {
                    status : false,
                    name : 'Rejected',
                    class: 'btn btn-danger m-2',
                    title: 'Reject',
                },
            ]
        },
        searchFilter: ["leave_type", "created_by"]
    };

    paginationConfig = {
        data: [],
        currentPage: 1,
        recordPerPage: 5,
        totalRecordsCount: 0,
    }

    onActionRequestClick(requestObj: object) {
        let data = { leave_request_id: requestObj['id'], status_name: requestObj['status_name'], remarks: '' };
        this.leaveRequestService.processLeaveRequestFromService(data).
            subscribe({
                next: data => {
                    this.notification.showMessage("success", data.message);
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
        this.leaveRequestService.getDataFromService(id).
            subscribe(data => {
                console.log(data)
                this.tableData = data;
                this.paginationConfig = {
                    ...this.paginationConfig,
                    currentPage: 1,
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
                        console.log(this.paginationConfig.currentPage)

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

        this.leaveStatusService.getLeaveStatusData().subscribe(
            data => {
                this.options = data;
                console.log(this.options)
            }
        );
        
        this.getAll();
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}