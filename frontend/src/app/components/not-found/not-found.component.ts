import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-not-found',
    template: require('./not-found.component.html'),
    styleUrls: [require('./not-found.component.css')]
})
export class NotFoundComponent implements OnInit {

    ngOnInit(): void {}

    errors: Object = {
        statusCode: 404,
        message: "Sorry, the page you're looking for doesn't exist. If you think something is broken, report a problem.",
    }
}