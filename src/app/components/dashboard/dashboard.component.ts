import { Component } from '@angular/core';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { PeriodosService } from '../../services/periodos.service';
import PeriodoResponse from '../../models/periodo.response';
import { NgSelectComponent } from "@ng-select/ng-select";

import { FormsModule } from '@angular/forms';
import MovimentacaoCategoriaSomaResponse from '../../models/movimentacao.categoria.soma';
import MovimentacaoResponse from '../../models/movimentacao.response';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [NgSelectComponent, FormsModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  periodos: PeriodoResponse[] = [];
  categoriasSoma: MovimentacaoCategoriaSomaResponse[] = [];
  movimentacoes: MovimentacaoResponse[] = [];
  periodo_id: string = '';
  historico_ids: Array<string | null> = [null];
  ehMovimentacao: boolean = false;
  jaRetrocedeu: boolean = false;

  constructor(private movimentacaoService: MovimentacaoService
    , private periodoService: PeriodosService) { }

  async ngOnInit() {
    this.periodos = await this.periodoService.ListarAsync(new Date().getFullYear());
  }

  async onPeriodosChange() {  
    this.historico_ids=[];  
    await this.onMais(null);
  }

  async onMais(categoriaId: string | null) {    
    const response = await this.movimentacaoService.ListarPorCategoria(this.periodo_id, categoriaId, null, false); 

    if (response.nome_tipo === 'SomarMovimentacoesResponse') {
      this.categoriasSoma = response.resposta as MovimentacaoCategoriaSomaResponse[];
      this.ehMovimentacao = false;      
    } else if (response.nome_tipo === 'MovimentacaoResponse') {      
      this.movimentacoes = response.resposta as MovimentacaoResponse[];
      this.ehMovimentacao = true;
    }

    this.jaRetrocedeu = false;
    this.historico_ids.push(categoriaId);
  }

  async retroceder() {
    if (!this.historico_ids.length) {
      return;
    }

    if (!this.jaRetrocedeu) {
      this.historico_ids.pop();
    }

    let ultimoId = this.historico_ids.pop();
    if (!ultimoId) ultimoId = null;

    this.jaRetrocedeu = true;
    await this.onMais(ultimoId);
  }
}
