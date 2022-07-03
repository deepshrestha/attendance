import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Notification } from "../../services/notification/notification.service";
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { MyProfileService } from "./../my-profile/my-profile.service";

@Component({
    selector: 'app-my-profile',
    template: require('./my-profile.component.html'),
    providers: [MyProfileService]
})
export class MyProfileComponent implements OnInit, OnDestroy {

    selectedFile: any = null;
    subscribeData: Subscription;
    myProfileService: MyProfileService;
    tokenStorageService: TokenStorageService;
    notification: Notification;

    constructor(
        @Inject(MyProfileService) myProfileService: MyProfileService,
        @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
        @Inject(Notification) notification: Notification
    ) {
        this.myProfileService = myProfileService;
        this.tokenStorageService = tokenStorageService;
        this.notification = notification;
    }

    profile: any = {};
    //image: any = {};

    getProfileById(): void {
        this.subscribeData = this.myProfileService.getDataByIdFromService(this.tokenStorageService.getUser().id)
        .subscribe(
            data => {
                //console.log(data)
                this.profile = data[0];
            }
        )
    }
    
    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
    }

    onUploadFileHandler() {
        const fileDescriptor = new FormData();
        fileDescriptor.append('image', this.selectedFile, this.selectedFile.name)
        this.subscribeData = this.myProfileService.postDataFromService(fileDescriptor, this.tokenStorageService.getUser().id)
        .subscribe(
            data => {
               //console.log(data)
                if(data.success){
                    this.notification.showMessage('success', data.message);
                    const input = <HTMLInputElement>document.querySelector('#image');
                    input.value = '';
                    this.getProfileById();
                    /* if (this.selectedFile) {
                        const input = <HTMLInputElement>document.querySelector('#image');
                        const reader = new FileReader();
                        reader.readAsDataURL(this.selectedFile);
                        reader.onload = (event) => {
                            var result = reader.result;
                            //console.log(result);
                            this.image = result;
                            input.value = ''; 
                        };
                    } */
                }
            }
        )
    }

    ngOnInit(): void {
        this.getProfileById();
    }

    ngOnDestroy(): void {
        this.subscribeData.unsubscribe();
    }
}