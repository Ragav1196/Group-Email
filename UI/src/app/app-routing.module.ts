import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateMailComponent } from './generate-mail/generate-mail.component';
import { GroupCreationComponent } from './group-creation/group-creation.component';
import { UserCreationComponent } from './user-creation/user-creation.component';

const routes: Routes = [
  { path: 'create-user', component: UserCreationComponent },
  { path: 'create-group', component: GroupCreationComponent },
  { path: 'schedule-mail', component: GenerateMailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
