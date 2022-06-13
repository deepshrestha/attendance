import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";

@Component({
    selector: 'app-modal',
    template: require('./modal.component.html'),
})
export class ModalComponent implements OnInit {

    @Input() modalTitle: string;
    @Input() modalBody: TemplateRef<any>;
    @Output() onSaveInfo = new EventEmitter<{event: any}>();
    @Output() onCancel = new EventEmitter<any>();

    ngOnInit(): void {}

    onSaveHandler(event: any): void {
        this.onSaveInfo.emit({event});
    }

    onCancelModalHandler(){
        this.onCancel.emit();
    }
}