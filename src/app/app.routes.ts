import { Routes } from '@angular/router';
import { MovimentacaoComponent } from './components/movimentacao/movimentacao.component';
import { InstituicaoComponent } from './components/instituicao/instituicao.component';
import { CategoriaComponent } from './components/categoria/categoria/categoria.component';

export const routes: Routes = [
  { path: 'movimentacao', component: MovimentacaoComponent },
  { path: 'instituicao', component: InstituicaoComponent },
  { path: 'categoria', component: CategoriaComponent },
  { path: '', redirectTo: '/movimentacao', pathMatch: 'full' }
];
