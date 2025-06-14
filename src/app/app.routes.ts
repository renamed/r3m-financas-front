import { Routes } from '@angular/router';
import { MovimentacaoComponent } from './components/movimentacao/movimentacao.component';

export const routes: Routes = [
  { path: 'movimentacao', component: MovimentacaoComponent },
  { path: '', redirectTo: '/movimentacao', pathMatch: 'full' }
];
