import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,  
  standalone: true,
  imports: [RouterModule, SweetAlert2Module]
})
export class AppComponent {
  title = 'r3m-financas-front';
}
