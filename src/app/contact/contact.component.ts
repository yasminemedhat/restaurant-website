import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { ContactType, Feedback } from "../shared/feedback";
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from "../services/feedback.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display:block;'
  },
  animations: [flyInOut(), expand()]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild("fform", { static: false })
  feedbackFormDirective: NgForm;
  submittedFeedback: Feedback;
  errMsg: string;
  showForm: boolean = true;

  formErrors = {
    firstname: "",
    lastname: "",
    telnum: 0,
    email: "",
  };

  validationMessages = {
    firstname: {
      required: "First Name is required.",
      minlength: "First Name must be at least 3 characters long.",
      maxlength: "FirstName cannot be more than 25 characters long.",
    },
    lastname: {
      required: "Last Name is required.",
      minlength: "Last Name must be at least 3 characters long.",
      maxlength: "Last Name cannot be more than 25 characters long.",
    },
    telnum: {
      required: "Tel. number is required.",
      pattern: "Tel. number must contain only numbers.",
    },
    email: {
      required: "Email is required.",
      email: "Email not in valid format.",
    },
  };

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.pattern]],
      message: "",
      agree: false,
      contacttype: "None",
    });

    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChange(data)
    );

    this.onValueChange(); //re(set) form validations
  }

  onSubmit() {
    this.showForm= false;
    this.feedback = this.feedbackForm.value;
    this.feedbackService.submitFeedback(this.feedback)
      .subscribe(feedback => {
        this.submittedFeedback = feedback;
        setTimeout(()=>{    
          this.submittedFeedback = null;
        }, 5000);
        this.showForm = true;
      }
        , errM => this.errMsg = <any>errM)
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

  onValueChange(data?: any) {
    // if the form has not been created yet
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error messages if any
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] = messages[key] + " ";
            }
          }
        }
      }
    }
  }
}
