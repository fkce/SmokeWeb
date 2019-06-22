import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmokeviewComponent } from './views/smokeview/smokeview.component';

const routes: Routes = [
  {
    path: '',
    component: SmokeviewComponent
  },
  //{
  //  path: 'komisja',
  //  component: ManagerComponent,
  //  canActivate: [RoleGuard],
  //  data: {
  //    expectedRole: 'admin'
  //  }
  //},
  //{
  //  path: 'login',
  //  component: LoginComponent
  //},
  //{
  //  path: 'sp-pk',
  //  component: MainFormComponent,
  //  data: {
  //    kierunek: 'inzynieria',
  //    stopien: 'pierwszego',
  //    rodzaj: 'stacjonarne',
  //    studia: 'sp-pk'
  //  }
  //},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
