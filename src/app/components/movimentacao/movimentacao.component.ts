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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRefresh, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movimentacao',
  imports: [CommonModule, FormsModule, SweetAlert2Module, FontAwesomeModule],
  templateUrl: './movimentacao.component.html',
  styleUrl: './movimentacao.component.css'
})
export class MovimentacaoComponent {
  async onDeleteMovimentacao(movimentacaoId: string) {

    Swal.fire({
      title: 'Deletar movimentação',
      text: 'Você tem certeza que deseja deletar esta movimentação?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.movimentacaoService.DeletarAsync(movimentacaoId);
        const listarPromise = this.ListarInstituicoesAsync(true);
        Swal.fire({
          icon: 'success',
          title: 'Movimentação deletada',
          text: 'A movimentação foi deletada com sucesso.',
          allowOutsideClick: false
        });
        await listarPromise;
      }
    });
  }
  async onFiltroInstituicaoChange() {
    await this.OnListarMovimentacoesFiltroChangeAsync();
  }

  async onFiltroPeriodoChange() {
    await this.OnListarMovimentacoesFiltroChangeAsync();
  }

  private async OnListarMovimentacoesFiltroChangeAsync() {
    if (this.filtroInstituicaoId && this.filtroPeriodoId) {
      await this.ListarInstituicoesAsync(false);

      this.instituicao = this.instituicoes.find(i => i.instituicao_id === this.filtroInstituicaoId) || {
        instituicao_id: '',
        nome: '',
        saldo: 0,
        credito: false,
        movimentacoes: []
      };

      if (this.instituicao.instituicao_id) {
        this.instituicao.movimentacoes = await this.ListarMovimentacoesAsync(this.filtroInstituicaoId, this.filtroPeriodoId);
      } else {
        this.instituicao.movimentacoes = [];
      }
    } else {
      this.instituicao = {
        instituicao_id: '',
        nome: '',
        saldo: 0,
        credito: false,
        movimentacoes: []
      };
    }
  }
  categorias: CategoryResponse[] = [];
  periodos: PeriodoResponse[] = [];
  instituicoes: InstituicaoResponse[] = [];

  filtroInstituicaoId: string | null = null;
  filtroPeriodoId: string | null = null;

  faRefresh = faRefresh;
  faCopy = faCopy;
  faTrash = faTrash;

  periodoSelecionado: PeriodoResponse | null = null;
  categoriaSelecionada: CategoryResponse | null = null;
  instituicaoSelecionada: InstituicaoResponse | null = null;
  instituicao: InstituicaoResponse = {
    instituicao_id: '',
    nome: '',
    saldo: 0,
    credito: false,
    movimentacoes: []
  };

  movimentacao: MovimentacaoRequest = {
    data: new Date(),
    descricao: '',
    valor: 0,
    categoria_id: '',
    instituicao_id: '',
    periodo_id: ''
  };

  constructor(private categoryService: CategoriasService
    , private periodosService: PeriodosService
    , private instituicoesService: InstituicoesService
    , private movimentacaoService: MovimentacaoService
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.ListarCategorias(),
      this.ListarPeriodosAsync(),
      this.ListarInstituicoesAsync(false)
    ]);

    if (this.filtroPeriodoId && this.filtroInstituicaoId) {
      await this.OnListarMovimentacoesFiltroChangeAsync();
    }
  }

  async ListarCategorias() {
    try {
      const categorias_aux = await this.categoryService.ListarAsync();
      categorias_aux.sort((a, b) => a.nome.localeCompare(b.nome));
      this.categorias = categorias_aux;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar categorias',
        html: 'Não foi possível carregar as categorias. <p/> ' + error.message,
        allowOutsideClick: false
      });
    }
  }

  async ListarPeriodosAsync() {
    const year = new Date().getFullYear();
    try {
      const periodos_aux = await this.periodosService.ListarAsync(year);
      periodos_aux.sort((a, b) => a.nome.localeCompare(b.nome));
      this.periodos = periodos_aux;

      const hoje = new Date();
      const periodoAtual = periodos_aux.find(p => {
        const inicio = new Date(p.inicio);
        const fim = new Date(p.fim);
        return hoje >= inicio && hoje <= fim;
      });
      if (periodoAtual) {
        this.filtroPeriodoId = periodoAtual.periodo_id;
      }

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar períodos',
        html: 'Não foi possível carregar os períodos. <p/> ' + error.message,
        allowOutsideClick: false
      });
    }
  }

  async ListarInstituicoesAsync(gatilhoMudancaInstituicao: boolean) {
    try {
      const instituicoes_aux = await this.instituicoesService.ListarAsync();
      instituicoes_aux.sort((a, b) => a.nome.localeCompare(b.nome));
      this.instituicoes = instituicoes_aux;

      if (this.filtroInstituicaoId === null && this.instituicoes.length > 0) {
        this.filtroInstituicaoId = this.instituicoes[0].instituicao_id;
      }

      if (gatilhoMudancaInstituicao) {
        await this.onFiltroInstituicaoChange();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao listar instituições',
        html: 'Não foi possível listar as instituições. <p/> ' + error.message,
        allowOutsideClick: false
      });
    }
  }

  async ListarMovimentacoesAsync(instituicao_id: string, periodo_id: string): Promise<MovimentacaoResponse[]> {
    const movimentacoes = await this.movimentacaoService.ListarPorInstituicaoAsync(instituicao_id, periodo_id);

    movimentacoes.sort((a, b) => {
      const difData = new Date(a.data).getTime() - new Date(b.data).getTime();
      if (difData > 0) return -1;
      if (difData < 0) return 1;

      // if (a.valor > 0 && b.valor > 0) return b.valor - a.valor;
      // if (a.valor < 0 && b.valor < 0) return a.valor - b.valor;

      if (a.valor < b.valor) return 1;
      if (a.valor > b.valor) return -1;

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
          this.movimentacao.periodo_id = periodo.periodo_id;
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

  async onSubmit() {
    try {
      await this.movimentacaoService.AdicionarAsync(this.movimentacao);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao adicionar movimentação',
        html: 'Não foi possível adicionar a movimentação. <p/> ' + error.message,
        allowOutsideClick: false
      });
      return;
    }

    try {
      await this.ListarInstituicoesAsync(true);
    } catch (error: any) {
      Swal.fire({
        icon: 'warning',
        title: 'Erro ao listar instituições!',
        html: `Não é possível listar o saldo e novas movimentações das instituições. Entretanto, a movimentação foi adicionada com sucesso. <p/> ${error.message}`,
        allowOutsideClick: false
      });
    }
  }

  getProximaFatura(instituicao: InstituicaoResponse): number {
    if (!instituicao.credito) return 0;
    if (!instituicao.limite_credito) return 0;

    return Math.abs(instituicao.limite_credito) - Math.abs(instituicao.saldo);
  }

  copiarMovimentacoes(id_instituicao: string) {
    const instituicao = this.instituicoes.find(i => i.instituicao_id === id_instituicao);
    const movimentacoes = instituicao?.movimentacoes || [];
    const csv = movimentacoes.map(m => {
      const dataFormatada = m.data;
      const valorFormatado = m.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return `${dataFormatada};${dataFormatada};${m.descricao};;${valorFormatado};${valorFormatado}`;
    }).join('\n');

    try {
      navigator.clipboard.writeText(csv).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Movimentações copiadas',
          text: 'As movimentações foram copiadas para a área de transferência.',
          allowOutsideClick: false
        });
      }).catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao copiar movimentações',
          html: `Não foi possível copiar as movimentações. <p/> ${error.message}`,
          allowOutsideClick: false
        });
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao copiar movimentações',
        html: `Não foi possível copiar as movimentações. <p/> ${error.message}`,
        allowOutsideClick: false
      });
    }
  }

}
