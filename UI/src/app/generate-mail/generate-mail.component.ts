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
  files: any;
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
        '', [Validators.required]
      ],
      groupname: [
        ''
      ],
      date: [
        '', [Validators.required]
      ],

    })
  }


  // decode() {
  //   let val = "QzpcZmFrZXBhdGhcZG93bmxvYWQucG5n"
  //   let decoded = window.atob(val);
  //    window.open(decoded);

  // }

  handleUpload(event:any) {
    const file = event.target.files;
    console.log("FILES",file);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // console.log("ANSWER FOR BASE 64", reader.result);
      this.files = reader.result
    };
}



  sendMail() {
    let data = this.apMail.value;
    // let encode = window.btoa(data.files);
    // console.log('DECODED',window.atob(encode));    
    let sendData = {
      content: data.mailtemplate,
      attachment: [this.files] ,
      groupName: data.groupname,
      ScheduleDate: data.date
    }
    console.log('MAIL TEMPLATE', sendData);
    {
      this.api
        .post('/email-template', sendData)
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
