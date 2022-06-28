import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-table-modal',
    template: require('./table-modal.component.html'),
})
export class TableModalComponent implements OnInit {

    @Input() modalTitle: string;
    @Input() modalBody: TemplateRef<any>;

    ngOnInit(): void {}

}