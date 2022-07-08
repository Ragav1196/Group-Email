import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.css'],
})
export class UserCreationComponent implements OnInit {
  apform!: FormGroup;
  data: any;
  groupNames: string[] = [];

  constructor(
    private api: CommonServiceService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.api.get('/groups/get-groups').subscribe(
      (res: any) => {
        if (res['statusCode'] == 200) {
          this.groupNames.push(...res);
        } else {
          console.log(res['statusCode'], res);
          this.groupNames.push(...res);
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.apform = this.formBuilder.group({
      firtsname: ['', [Validators.required]],

      lastname: ['', [Validators.required]],

      phonenumber: ['', [Validators.required]],

      emailaddress: ['', [Validators.required]],

      groupname: ['', [Validators.required]],
    });
  }
  sendDetails() {
    let val = this.apform.value;

    let sendUser = {
      firstName: val.firtsname,
      lastName: val.lastname,
      mobile: val.phonenumber,
      email: val.emailaddress,
      groupName: val.groupname,
    };
    console.log('USER DEATILS', sendUser);

    {
      this.api.post('/users/create', sendUser).subscribe(
        (res: any) => {
          if (res['statusCode'] == 200) {
            console.log(this.data, 'res', res);
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
