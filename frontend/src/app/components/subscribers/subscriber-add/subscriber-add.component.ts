import { Component, OnInit, Inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SubscriberService } from "./../../../services/subscribers/subscriber.service";

@Component({
  selector: "app-subscriber-add",
  template: require("./subscriber-add.component.html"),
})
export class SubscriberAddComponent implements OnInit {
  basePathName = "subscribers";
  type = "add";

  subscriberForm: FormGroup = new FormGroup({
    email: new FormControl("")
  });
  isSubmitted = false;

  builder: FormBuilder;
  service: SubscriberService;
  router: Router;

  constructor(
    @Inject(FormBuilder) builder: FormBuilder,
    @Inject(SubscriberService) service: SubscriberService,
    @Inject(Router) router: Router
  ) {
    this.builder = builder;
    this.service = service;
    this.router = router;
  }

  ngOnInit(): void {
    this.subscriberForm = this.builder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.subscriberForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.subscriberForm.invalid) {
      return;
    }
    this.service.save(this.subscriberForm.value["email"]).subscribe({
      next: data => {
        alert(`Subscriber : ${data.email} created successfully`);
        this.router.navigateByUrl("subscribers");
      },
      error: err => {
        alert(err.message);
      }
    });
  }

  onReset(): void {
    this.isSubmitted = false;
    this.subscriberForm.reset();
  }
}
