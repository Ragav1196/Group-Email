import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.css']
})
export class GroupCreationComponent implements OnInit {

  apForm!: FormGroup;
  input: any;
  

  constructor(
    private api : CommonServiceService,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.apForm = this.formBuilder.group({
      groupname: [
        '',[Validators.required]
      ]
    })

  }

  sendForm() {
     
    let data = this.apForm.value;

    let sendData = {
      groupname: data.groupname,
    }
    console.log('GROUP NAME', sendData);
    {
      this.api
        .post('/groupname', sendData)
        .subscribe(
          (res: any) => {
            if (res['statusCode'] == 200) {
              console.log(this.input, 'res', res);
              this.ngOnInit();
            } else {
              console.log(res['statusCode'], res);
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  



}
