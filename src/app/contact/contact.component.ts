import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { ContactType, Feedback } from "../shared/feedback";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform', {static: false})
  feedbackFormDirective: NgForm;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      telnum: [0, Validators.required],
      email: ["", Validators.required],
      message: "",
      agree: false,
      contacttype: "None",
    });
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telnum: 0,
      email: "",
      message: "",
      agree: false,
      contacttype: "None",
    });
    this.feedbackFormDirective.resetForm();
  }
}
