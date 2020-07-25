import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AuthComponentRoutingModule } from './auth-routing.module';

import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthComponentRoutingModule,
  ],
  providers: [],
  declarations: [AuthComponent],
})
export class AuthPageModule {}
