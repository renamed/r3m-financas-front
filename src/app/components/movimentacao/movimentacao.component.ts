import { Component } from '@angular/core';
import { CategoriasService } from '../../services/categorias.service';
import { PeriodosService } from '../../services/periodos.service';
import { InstituicoesService } from '../../services/instituicoes.service';
import { CommonModule } from '@angular/common';
import CategoryResponse from '../../models/categoria.response';
import PeriodoResponse from '../../models/periodo.response';
import InstituicaoResponse from '../../models/instituicao.response';
import { FormsModule } from '@angular/forms';
import MovimentacaoResponse from '../../models/movimentacao.response';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { MovimentacaoRequest } from '../../models/movimentacao.request';

@Component({
  selector: 'app-movimentacao',
  imports: [CommonModule, FormsModule],
  templateUrl: './movimentacao.component.html',
  styleUrl: './movimentacao.component.css'
})
export class MovimentacaoComponent {
  async onSubmit() {
    try {
      await this.movimentacaoService.AdicionarAsync(this.movimentacao);
      await this.ListarInstituicoesAsync();      
    } catch (error) {
      alert(error)
    }
    
  }
  periodoSelecionado: PeriodoResponse | null = null;
  categoriaSelecionada: CategoryResponse | null = null;
  instituicaoSelecionada: InstituicaoResponse | null = null;  
  movimentacao : MovimentacaoRequest = {
    data: new Date(),
    descricao: '',
    valor: 0,
    categoriaId: '',
    instituicaoId: '',
    periodoId: ''
  };

  categorias: CategoryResponse[] = [];
  periodos: PeriodoResponse[] = [];
  instituicoes: InstituicaoResponse[] = [];

  constructor(private categoryService: CategoriasService
    , private periodosService: PeriodosService
    , private instituicoesService: InstituicoesService
    , private movimentacaoService: MovimentacaoService
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.ListarCategorias(),
      this.ListarPeriodosAsync(),
      this.ListarInstituicoesAsync()
    ]);
  }

  async ListarCategorias() {
    try {
      const categorias_aux = await this.categoryService.ListarAsync();      
      categorias_aux.sort((a, b) => a.nome.localeCompare(b.nome));
      this.categorias = categorias_aux;
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
    }
  }

  async ListarPeriodosAsync() {
    const year = new Date().getFullYear();
    try {
      const periodos_aux = await this.periodosService.ListarAsync(year);
      periodos_aux.sort((a, b) => a.nome.localeCompare(b.nome));
      this.periodos = periodos_aux;
    } catch (error) {
      console.error('Erro ao listar períodos:', error);
    }
  }

  async ListarInstituicoesAsync() {
    try {
      const instituicoes_aux = await this.instituicoesService.ListarAsync();
      for(const inst of instituicoes_aux) {
        inst.movimentacoes = await this.ListarUltimasMovimentacoesPorInstituicaoAsync(inst.instituicaoId);
      }

      instituicoes_aux.sort((a, b) => a.nome.localeCompare(b.nome));
      this.instituicoes = instituicoes_aux;
    } catch (error) {
      console.error('Erro ao listar instituições:', error);
    }
  }

  async ListarUltimasMovimentacoesPorInstituicaoAsync(instituicaoId: string) : Promise<MovimentacaoResponse[]> {
    const movimentacoes = await this.movimentacaoService.ListarPorInstituicaoAsync(instituicaoId);

    movimentacoes.sort((a, b) => {
      if (a.valor > 0 && b.valor > 0) return b.valor - a.valor;
      if (a.valor < 0 && b.valor < 0) return a.valor - b.valor;

      if (a.valor < b.valor) return 1;
      if (a.valor > b.valor) return -1;

      const difData = new Date(a.data).getTime() - new Date(b.data).getTime();
      if (difData < 0) return -1;
      if (difData > 0) return 1;

      return a.descricao.localeCompare(b.descricao);
    });

    return movimentacoes;
  }

  onDataChange($event: Event) {
    if (this.periodos.length > 0) {
      const dataInput = $event.target as HTMLInputElement;      
      const selectedDate = new Date(dataInput.value);
      this.periodos.forEach(periodo => {                
        const aposInicio = selectedDate >= new Date(periodo.inicio);
        const antesFim = selectedDate <= new Date(periodo.fim);
        if (aposInicio && antesFim) {
          this.movimentacao.periodoId = periodo.periodoId;
        }
      });
    }
  }

onValorInput(event: any) {
  let value = event.target.value;

  // Verifica se possui o caractere "-"
  const isNegative = value.trim().includes('-');

  // Remove tudo que não for dígito
  value = value.replace(/[^\d]/g, '');

  if (value.length === 0) value = '0';

  // Converte para float (centavos)
  let floatValue = parseFloat((parseInt(value, 10) / 100).toFixed(2));
  if (isNegative) floatValue = -floatValue;

  // Atualiza o modelo
  this.movimentacao.valor = floatValue;

  // Atualiza o input formatado
  const formatted = floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  event.target.value = formatted;
}


}
