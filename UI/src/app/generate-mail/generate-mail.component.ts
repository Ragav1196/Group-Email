import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../common-service.service';
@Component({
  selector: 'app-generate-mail',
  templateUrl: './generate-mail.component.html',
  styleUrls: ['./generate-mail.component.css']
})
export class GenerateMailComponent implements OnInit {

  apMail!: FormGroup;
  rep: any;
  constructor(
    private api: CommonServiceService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.apMail = this.formBuilder.group({
      mailtemplate: [
        '', [Validators.required]
      ],
      files: [
        [], [Validators.required]
      ],
      groupname: [
        '', [Validators.required]
      ],
      date: [
        '', [Validators.required]
      ],

    })
  }
  sendMail() {
    let data = this.apMail.value;
    let encode = window.btoa(data.files);
    let sendData = {
      mailtemplate: data.mailtemplate,
      files: encode,
      groupname: data.groupname,
      date: data.date
    }
    console.log('MAIL TEMPLATE', sendData);
    {
      this.api
        .post('/mail-template', sendData)
        .subscribe(
          (res: any) => {
            if (res['statusCode'] == 200) {
              console.log(this.rep, 'res', res);
              this.ngOnInit();
            } else {
              console.log(res['statusCode'], res);
            }
          },
          (err) => {
            console.log(err);
          }
      )
    }
  }
}
