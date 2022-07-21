import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss'],
})
export class GroupCreationComponent implements OnInit {
  apForm!: FormGroup;
  input: any;

  constructor(
    private api: CommonServiceService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.apForm = this.formBuilder.group({
      groupname: ['', [Validators.required]],
    });
  }

  sendForm() {
    let data = this.apForm.value;

    let sendData = {
      groupName: data.groupname,
    };
    console.log('GROUP NAME', sendData);
    {
      this.api.post('/groups/create', sendData).subscribe(
        (res: any) => {
          console.log(this.input, 'res', res);
          this.ngOnInit();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
