import { Component, OnInit, Inject } from "@angular/core";
import { Subscription } from "rxjs";
import { formValidator } from "./../../helpers/form-validator";
import { Notification } from "../../services/notification/notification.service";
import { ImportUserDataService } from "./../import-user-data/import-user-data.service";
import * as XLSX from 'xlsx';

@Component({
    selector: "app-import-user-data",
    template: require("./import-user-data.component.html"),
    providers: [ImportUserDataService]
})
export class ImportUserData implements OnInit {
    
    fields: any = {};
    errors: any = {};
    onHandleSubmit: any;
    onHandleFileUpload: any;
    subscribeData: Subscription;
    importUserDataService: ImportUserDataService;
    notification: Notification;

    constructor(
        @Inject(ImportUserDataService) importUserDataService: ImportUserDataService,
        @Inject(Notification) notification: Notification
    ) {
        this.importUserDataService = importUserDataService;
        this.notification = notification;
    }

    initialState = {
        file_name: '',
        errors: {
            file_name: '',
        }
    };

    users: any = {};
    selectedFile: any = null;

    initializeFormValidation() {
        const { onHandleSubmit, onHandleFileUpload, fields } = formValidator(this.initialState);

        this.onHandleSubmit = onHandleSubmit;
        this.onHandleFileUpload = onHandleFileUpload;
        this.fields = fields;
        this.errors = fields.errors;
    }

    importData(event: any, obj: any): void {
        event.preventDefault();
        if (this.onHandleSubmit(event)) {
            //console.log(event.target.elements["file_name"].files[0]);
            this.selectedFile = event.target.elements["file_name"].files[0];
            if (this.selectedFile) {
                const input = <HTMLInputElement>document.querySelector('#import_file');
                const reader = new FileReader();
                reader.readAsBinaryString(this.selectedFile);
                reader.onload = (event) => {
                    var result = reader.result;

                    var workbook = XLSX.read(result, {
                        type: 'binary'
                    });

                    workbook.SheetNames.forEach(sheetName => {
                        var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                        XL_row_object.map(row => {
                            /* columns.map(column => {
                                console.log(row[column]); */
                                this.importUserDataService.postDataFromService(row)
                                .subscribe(
                                    data => {
                                        if(data.success) {
                                            this.notification.showMessage('success', data.message);
                                            console.log(data);
                                            input.value = ''; 
                                        }
                                    }
                                )
                            //})
                        })
                    })
                    
                };
            }
        }
    }

    reInitializeState() {
        this.initialState = {
            ...this.initialState,
            file_name: '',
            errors: {
                file_name: '',
            }
        }
    }

    onCancelModal() {
        this.reInitializeState();
        this.initializeFormValidation();
    }

    ngOnInit(): void {
        this.initializeFormValidation();
    }
    
}
