import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GroupCreationComponent } from './group-creation/group-creation.component';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { GenerateMailComponent } from './generate-mail/generate-mail.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupCreationComponent,
    UserCreationComponent,
    GenerateMailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
