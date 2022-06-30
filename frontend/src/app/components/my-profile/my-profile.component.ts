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

    getProfileById(): void {
        this.subscribeData = this.myProfileService.getDataByIdFromService(this.tokenStorageService.getUser().id)
        .subscribe(
           data => {
               console.log(data)
               this.profile = data[0];
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