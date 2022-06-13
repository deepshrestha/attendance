import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { SubscriberService } from "./../../services/subscribers/subscriber.service";

@Component({
  selector: "app-pc-registration",
  template: require("./pc-registration.component.html"),
})
export class PcRegistrationComponent implements OnInit {
  registrationForm: FormGroup = new FormGroup({});
  isLoading: boolean = true;
  isCompleted: boolean = false;
  hasUuid = false;
  hasIpaddress = false;
  hasMacid = false;
  hasHwid = false;
  displayMessage = "Loading...";
  isInformationChanged = false;
  isUserValidated = false;
  fetchUserInfo = true;

  constructor(
    private formBuilder: FormBuilder,
    private service: SubscriberService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.isInformationChanged) {
        this.displayMessage = "The source of this url is not valid";
        this.isCompleted = true;
      }
    }, 40000);
    this.setForm();
  }

  setForm() {
    this.registrationForm = this.formBuilder.group({
      txtFullName: new FormControl("", [Validators.required]),
      txtCity: new FormControl("", [Validators.required]),
      txtEmail: new FormControl("", [Validators.required, Validators.email]),
      txtTelephoneNo: new FormControl("", [Validators.required])
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }

  clearForm() {
    var texts = document.getElementsByTagName("input");
    for (var i_tem = 0; i_tem < texts.length; i_tem++)
      if (texts[i_tem].type == "text") texts[i_tem].value = "";
  }

  onSubmitHandler() {
    this.service.register(this.registrationForm.value).subscribe(data => {
      this.isCompleted = true;
      this.displayMessage = data.message;
    });
  }

  onUserInformationChange(e: any) {
    this.isInformationChanged = true;
    switch (e.target.id) {
      case "uuidInitial":
        this.registrationForm.addControl(
          "uuid",
          new FormControl(e.target.value)
        );
        break;

      case "ipaddressInitial":
        this.registrationForm.addControl(
          "ipaddress",
          new FormControl(e.target.value)
        );
        break;

      case "macidInitial":
        this.registrationForm.addControl(
          "macid",
          new FormControl(e.target.value)
        );
        break;

      case "hwidInitial":
        this.registrationForm.addControl(
          "hwid",
          new FormControl(e.target.value)
        );
        break;

      default:
        break;
    }
    this.isLoading = !(
      this.registrationForm.contains("uuid") &&
      this.registrationForm.contains("ipaddress") &&
      this.registrationForm.contains("macid") &&
      this.registrationForm.contains("hwid")
    );
  }
}
