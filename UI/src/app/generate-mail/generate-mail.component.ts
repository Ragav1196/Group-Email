import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../common-service.service';
@Component({
  selector: 'app-generate-mail',
  templateUrl: './generate-mail.component.html',
  styleUrls: ['./generate-mail.component.css'],
})
export class GenerateMailComponent implements OnInit {
  apMail!: FormGroup;
  files: object | undefined;
  rep: any;
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

    this.apMail = this.formBuilder.group({
      mailtemplate: ['', [Validators.required]],
      files: ['', [Validators.required]],
      groupname: [''],
      date: ['', [Validators.required]],
    });
  }

  // decode() {
  //   let val = "QzpcZmFrZXBhdGhcZG93bmxvYWQucG5n"
  //   let decoded = window.atob(val);
  //    window.open(decoded);

  // }

  handleUpload(event: any) {
    const toBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const tobase64Handler = async (files: any) => {
      const filePathsPromises: any = [];
      for (let i = 0; i < files.length; i++) {
        filePathsPromises.push(toBase64(files[i]));
      }
      const filePaths = await Promise.all(filePathsPromises);
      const mappedFiles = filePaths.map((base64File, i) => {
        return { base64File, type: files[0].type };
      });
      return mappedFiles;
    };

    tobase64Handler(event.target.files).then((x) => (this.files = x));
  }

  sendMail() {
    let data = this.apMail.value;
    // let encode = window.btoa(data.files);
    // console.log('DECODED',window.atob(encode));
    let sendData = {
      content: data.mailtemplate,
      attachment: this.files,
      groupName: data.groupname,
      ScheduleDate: data.date,
    };
    console.log('MAIL TEMPLATE', sendData);
    {
      this.api.post('/email-template', sendData).subscribe(
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
      );
    }
  }
}
