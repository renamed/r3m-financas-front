import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimentacaoComponent } from './movimentacao.component';
import { CategoriasService } from '../../services/categorias.service';
import { PeriodosService } from '../../services/periodos.service';
import { InstituicoesService } from '../../services/instituicoes.service';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import CategoryResponse from '../../models/categoria.response';
import PeriodoResponse from '../../models/periodo.response';
import InstituicaoResponse from '../../models/instituicao.response';
import MovimentacaoResponse from '../../models/movimentacao.response';
import Swal from 'sweetalert2';

// Mocks com tipos corretos
const mockCategorias: CategoryResponse[] = [
  { categoria_id: '1', nome: 'Alimentação' },
  { categoria_id: '2', nome: 'Transporte' }
];
const mockPeriodos: PeriodoResponse[] = [
  { periodo_id: '1', nome: 'Janeiro', inicio: new Date('2025-01-01'), fim: new Date('2025-01-31') },
  { periodo_id: '2', nome: 'Fevereiro', inicio: new Date('2025-02-01'), fim: new Date('2025-02-28') }
];

const mockInstituicoes: InstituicaoResponse[] = [
  {
    instituicao_id: '1',
    nome: 'Banco A',
    saldo: 100,
    credito: false,
    movimentacoes: [] as MovimentacaoResponse[]
  },
  {
    instituicao_id: '2',
    nome: 'Banco B',
    saldo: 200,
    credito: false,
    movimentacoes: [] as MovimentacaoResponse[]
  }
];

const mockMovimentacoes: MovimentacaoResponse[] = [
  { movimentacao_id: 'm1', valor: 10, data: new Date('2025-01-01'), descricao: 'Teste 1', categoria: mockCategorias[0], instituicao: undefined as any, periodo: mockPeriodos[0] },
  { movimentacao_id: 'm2', valor: -5, data: new Date('2025-01-02'), descricao: 'Teste 2', categoria: mockCategorias[1], instituicao: undefined as any, periodo: mockPeriodos[1] }
];
// Preenche movimentacoes e referencia circular
mockMovimentacoes.forEach(m => (m.instituicao = mockInstituicoes[0]));
mockInstituicoes[0].movimentacoes = mockMovimentacoes;

describe('MovimentacaoComponent', () => {
  let component: MovimentacaoComponent;
  let fixture: ComponentFixture<MovimentacaoComponent>;
  let categoriasService: jasmine.SpyObj<CategoriasService>;
  let periodosService: jasmine.SpyObj<PeriodosService>;
  let instituicoesService: jasmine.SpyObj<InstituicoesService>;
  let movimentacaoService: jasmine.SpyObj<MovimentacaoService>;

  beforeEach(async () => {
    categoriasService = jasmine.createSpyObj('CategoriasService', ['ListarAsync']);
    periodosService = jasmine.createSpyObj('PeriodosService', ['ListarAsync']);
    instituicoesService = jasmine.createSpyObj('InstituicoesService', ['ListarAsync']);
    movimentacaoService = jasmine.createSpyObj('MovimentacaoService', ['AdicionarAsync', 'ListarPorInstituicaoAsync']);

    await TestBed.configureTestingModule({
      imports: [MovimentacaoComponent, FormsModule, CommonModule],
      providers: [
        { provide: CategoriasService, useValue: categoriasService },
        { provide: PeriodosService, useValue: periodosService },
        { provide: InstituicoesService, useValue: instituicoesService },
        { provide: MovimentacaoService, useValue: movimentacaoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovimentacaoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and list all', async () => {
    categoriasService.ListarAsync.and.returnValue(Promise.resolve([...mockCategorias]));
    periodosService.ListarAsync.and.returnValue(Promise.resolve([...mockPeriodos]));
    instituicoesService.ListarAsync.and.returnValue(Promise.resolve([...mockInstituicoes]));
    movimentacaoService.ListarPorInstituicaoAsync.and.returnValue(Promise.resolve([...mockMovimentacoes]));
    await component.ngOnInit();
    expect(component.categorias.length).toBe(2);
    expect(component.periodos.length).toBe(2);
    expect(component.instituicoes.length).toBe(2);
  });

  it('should handle error in ListarCategorias', async () => {
    categoriasService.ListarAsync.and.returnValue(Promise.reject('erro'));
    const spy = spyOn<any>(Swal, 'fire');
    await component.ListarCategorias();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle error in ListarPeriodosAsync', async () => {
    periodosService.ListarAsync.and.returnValue(Promise.reject('erro'));
    const spy = spyOn<any>(Swal, 'fire');
    await component.ListarPeriodosAsync();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle error in ListarInstituicoesAsync', async () => {
    instituicoesService.ListarAsync.and.returnValue(Promise.reject('erro'));
    const spy = spyOn<any>(Swal, 'fire');
    await component.ListarInstituicoesAsync(false);
    expect(spy).toHaveBeenCalled();
  });

  it('should call ListarUltimasMovimentacoesPorInstituicaoAsync and sort', async () => {
    movimentacaoService.ListarPorInstituicaoAsync.and.returnValue(Promise.resolve([...mockMovimentacoes]));
    const result = await component.ListarMovimentacoesAsync('1', '1');
    expect(result.length).toBe(2);
  });

  it('should call onDataChange and set periodo_id', () => {
    component.periodos = [...mockPeriodos];
    const event = { target: { value: '2025-01-15' } } as any;
    component.movimentacao.periodo_id = '';
    component.onDataChange(event);
    expect(component.movimentacao.periodo_id).toBe('1');
  });

  it('should call onValorInput and update value (positive)', () => {
    const event = { target: { value: '1234' } } as any;
    component.movimentacao.valor = 0;
    component.onValorInput(event);
    expect(component.movimentacao.valor).toBe(12.34);
    expect(event.target.value).toContain('R$');
  });

  it('should call onValorInput and update value (negative)', () => {
    const event = { target: { value: '-5678' } } as any;
    component.movimentacao.valor = 0;
    component.onValorInput(event);
    expect(component.movimentacao.valor).toBe(-56.78);
    expect(event.target.value).toContain('R$');
  });

  it('should call onSubmit and handle success', async () => {
    movimentacaoService.AdicionarAsync.and.returnValue(Promise.resolve());
    spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.resolve());
    await component.onSubmit();
    expect(movimentacaoService.AdicionarAsync).toHaveBeenCalled();
    expect(component.ListarInstituicoesAsync).toHaveBeenCalled();
  });

  it('should call onSubmit and handle error', async () => {
    movimentacaoService.AdicionarAsync.and.returnValue(Promise.reject({ message: 'erro' }));
    const spy = spyOn<any>(Swal, 'fire');
    await component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call copiarMovimentacoes and copy to clipboard (success)', async () => {
    const instituicao = { ...mockInstituicoes[0], movimentacoes: [...mockMovimentacoes] };
    component.instituicoes = [instituicao];
    const clipboardSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const swalSpy = spyOn<any>(Swal, 'fire');
    await component.copiarMovimentacoes(instituicao.instituicao_id);
    expect(clipboardSpy).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
  });

  it('should call copiarMovimentacoes and handle clipboard error', async () => {
    const instituicao = { ...mockInstituicoes[0], movimentacoes: [...mockMovimentacoes] };
    component.instituicoes = [instituicao];
    const clipboardSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject({ message: 'erro' }));
    const swalSpy = spyOn<any>(Swal, 'fire').and.callThrough();
    // Precisa aguardar o catch da promise
    await component.copiarMovimentacoes(instituicao.instituicao_id);
    // Aguarda o event loop para garantir que o catch foi executado
    await new Promise(res => setTimeout(res));
    expect(clipboardSpy).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error' }));
  });

  it('should not fail copiarMovimentacoes if instituicao not found', async () => {
    component.instituicoes = [];
    const clipboardSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const swalSpy = spyOn<any>(Swal, 'fire');
    await component.copiarMovimentacoes('nao-existe');
    // clipboard.writeText deve ser chamado com string vazia
    expect(clipboardSpy).toHaveBeenCalledWith('');
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
  });

  it('should not set periodo_id if no periodos match in onDataChange', () => {
    component.periodos = [...mockPeriodos];
    const event = { target: { value: '2024-12-01' } } as any;
    component.movimentacao.periodo_id = '';
    component.onDataChange(event);
    expect(component.movimentacao.periodo_id).toBe('');
  });

  it('should handle onValorInput with empty value', () => {
    const event = { target: { value: '' } } as any;
    component.movimentacao.valor = 0;
    component.onValorInput(event);
    expect(component.movimentacao.valor).toBe(0);
    expect(event.target.value).toContain('R$');
  });

  it('should handle onValorInput with only negative sign', () => {
    const event = { target: { value: '-' } } as any;
    component.movimentacao.valor = 0;
    component.onValorInput(event);
    expect(component.movimentacao.valor).toBe(0);
    expect(event.target.value).toContain('R$');
  });

  it('should sort movimentacoes correctly in ListarUltimasMovimentacoesPorInstituicaoAsync', async () => {
    const movs = [
      { ...mockMovimentacoes[0], valor: 10, data: new Date('2025-01-01'), descricao: 'A' },
      { ...mockMovimentacoes[1], valor: 20, data: new Date('2025-01-02'), descricao: 'B' },
      { ...mockMovimentacoes[1], valor: -30, data: new Date('2025-01-02'), descricao: 'C' },
      { ...mockMovimentacoes[0], valor: -40, data: new Date('2025-01-01'), descricao: 'D' }
    ];
    movimentacaoService.ListarPorInstituicaoAsync.and.returnValue(Promise.resolve(movs));
    const result = await component.ListarMovimentacoesAsync('1', '1');
    expect(result.length).toBe(4);
    // Esperado: data mais recente primeiro, depois valor desc, depois descrição
    expect(result[0].valor).toBe(20); // 2025-01-02, maior valor
    expect(result[1].valor).toBe(-30); // 2025-01-02, menor valor
    expect(result[2].valor).toBe(10); // 2025-01-01, maior valor
    expect(result[3].valor).toBe(-40); // 2025-01-01, menor valor
  });

  it('should call onFiltroInstituicaoChange and update instituicao.movimentacoes', async () => {
    const spy = spyOn<any>(component as any, 'OnListarMovimentacoesFiltroChangeAsync').and.returnValue(Promise.resolve());
    await component.onFiltroInstituicaoChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onFiltroPeriodoChange and update instituicao.movimentacoes', async () => {
    const spy = spyOn<any>(component as any, 'OnListarMovimentacoesFiltroChangeAsync').and.returnValue(Promise.resolve());
    await component.onFiltroPeriodoChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should call OnListarMovimentacoesFiltroChangeAsync and update instituicao', async () => {
    component.filtroInstituicaoId = '1';
    component.filtroPeriodoId = '1';
    spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.resolve());
    spyOn(component, 'ListarMovimentacoesAsync').and.returnValue(Promise.resolve([...mockMovimentacoes]));
    component.instituicoes = [...mockInstituicoes];
    await (component as any).OnListarMovimentacoesFiltroChangeAsync();
    expect(component.instituicao.instituicao_id).toBe('1');
    expect(component.instituicao.movimentacoes.length).toBe(2);
  });

  it('should not update instituicao if filtroInstituicaoId or filtroPeriodoId is missing', async () => {
    component.filtroInstituicaoId = null;
    component.filtroPeriodoId = '1';
    const spy = spyOn(component, 'ListarInstituicoesAsync');
    await (component as any).OnListarMovimentacoesFiltroChangeAsync();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call ngOnInit and trigger OnListarMovimentacoesFiltroChangeAsync if filters are set', async () => {
    spyOn(component, 'ListarCategorias').and.returnValue(Promise.resolve());
    spyOn(component, 'ListarPeriodosAsync').and.returnValue(Promise.resolve());
    spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.resolve());
    component.filtroPeriodoId = '1';
    component.filtroInstituicaoId = '1';
    const spy = spyOn<any>(component as any, 'OnListarMovimentacoesFiltroChangeAsync').and.returnValue(Promise.resolve());
    await component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call copiarMovimentacoes with no movimentacoes', async () => {
    const instituicao = { ...mockInstituicoes[0], movimentacoes: [] };
    component.instituicoes = [instituicao];
    const clipboardSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const swalSpy = spyOn<any>(Swal, 'fire');
    await component.copiarMovimentacoes(instituicao.instituicao_id);
    expect(clipboardSpy).toHaveBeenCalledWith('');
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
  });

  it('should call onSubmit and show warning if ListarInstituicoesAsync fails', async () => {
    movimentacaoService.AdicionarAsync.and.returnValue(Promise.resolve());
    spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.reject({ message: 'erro' }));
    const swalSpy = spyOn<any>(Swal, 'fire');
    await component.onSubmit();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'warning' }));
  });

  it('should reset instituicao if filtroInstituicaoId or filtroPeriodoId is missing in OnListarMovimentacoesFiltroChangeAsync', async () => {
    component.filtroInstituicaoId = null;
    component.filtroPeriodoId = null;
    component.instituicao = { instituicao_id: 'x', nome: 'x', saldo: 1, credito: false, movimentacoes: [{} as any] };
    await (component as any).OnListarMovimentacoesFiltroChangeAsync();
    expect(component.instituicao.instituicao_id).toBe('');
    expect(component.instituicao.movimentacoes.length).toBe(0);
  });

  it('should set empty movimentacoes if instituicao not found in OnListarMovimentacoesFiltroChangeAsync', async () => {
    component.filtroInstituicaoId = 'notfound';
    component.filtroPeriodoId = '1';
    component.instituicoes = [];
    await (component as any).OnListarMovimentacoesFiltroChangeAsync();
    expect(component.instituicao.movimentacoes.length).toBe(0);
  });

  it('should not call onFiltroInstituicaoChange if gatilhoMudancaInstituicao is false', async () => {
    instituicoesService.ListarAsync.and.returnValue(Promise.resolve([...mockInstituicoes]));
    const spy = spyOn(component, 'onFiltroInstituicaoChange');
    await component.ListarInstituicoesAsync(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle error in copiarMovimentacoes when navigator.clipboard.writeText throws synchronously', async () => {
    const instituicao = { ...mockInstituicoes[0], movimentacoes: [...mockMovimentacoes] };
    component.instituicoes = [instituicao];
    spyOn(navigator.clipboard, 'writeText').and.callFake(() => { throw new Error('sync error'); });
    const swalSpy = spyOn<any>(Swal, 'fire');
    try {
      component.copiarMovimentacoes(instituicao.instituicao_id);
    } catch {}
    expect(swalSpy).toHaveBeenCalled();
  });

  it('should not set filtroInstituicaoId if instituicoes is empty in ListarInstituicoesAsync', async () => {
    instituicoesService.ListarAsync.and.returnValue(Promise.resolve([]));
    component.filtroInstituicaoId = null;
    await component.ListarInstituicoesAsync(false);
    expect(component.filtroInstituicaoId).toBeNull();
  });

  it('should not set filtroPeriodoId if no period matches today in ListarPeriodosAsync', async () => {
    const periodos = [
      { periodo_id: '3', nome: 'Março', inicio: new Date('2020-03-01'), fim: new Date('2020-03-31') }
    ];
    periodosService.ListarAsync.and.returnValue(Promise.resolve(periodos));
    component.filtroPeriodoId = null;
    await component.ListarPeriodosAsync();
    expect(component.filtroPeriodoId).toBeNull();
  });

  it('should not update periodo_id in onDataChange if periodos is empty', () => {
    component.periodos = [];
    component.movimentacao.periodo_id = 'x';
    const event = { target: { value: '2025-01-15' } } as any;
    component.onDataChange(event);
    expect(component.movimentacao.periodo_id).toBe('x');
  });

  it('should handle onValorInput with non-numeric and non-negative', () => {
    const event = { target: { value: 'abc' } } as any;
    component.movimentacao.valor = 0;
    component.onValorInput(event);
    expect(component.movimentacao.valor).toBe(0);
    expect(event.target.value).toContain('R$');
  });

  it('should handle onValorInput with whitespace', () => {
    const event = { target: { value: '   ' } } as any;
    component.movimentacao.valor = 0;
    component.onValorInput(event);
    expect(component.movimentacao.valor).toBe(0);
    expect(event.target.value).toContain('R$');
  });

  it('should return 0 in getProximaFatura if not credito', () => {
    const inst = { ...mockInstituicoes[0], credito: false };
    expect(component.getProximaFatura(inst)).toBe(0);
  });

  it('should return 0 in getProximaFatura if limite_credito is undefined', () => {
    const inst = { ...mockInstituicoes[0], credito: true, limite_credito: undefined };
    expect(component.getProximaFatura(inst)).toBe(0);
  });

  it('should return correct value in getProximaFatura', () => {
    const inst = { ...mockInstituicoes[0], credito: true, limite_credito: 1000, saldo: -200 };
    expect(component.getProximaFatura(inst)).toBe(800);
  });

  it('should handle onDataChange with invalid event', () => {
    component.periodos = [...mockPeriodos];
    const event = { target: {} } as any;
    component.movimentacao.periodo_id = 'x';
    component.onDataChange(event);
    expect(component.movimentacao.periodo_id).toBe('x');
  });

  it('should handle copiarMovimentacoes with undefined instituicao', async () => {
    component.instituicoes = [];
    const clipboardSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const swalSpy = spyOn<any>(Swal, 'fire');
    await component.copiarMovimentacoes('nao-existe');
    expect(clipboardSpy).toHaveBeenCalledWith('');
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
  });

  describe('onDeleteMovimentacao', () => {
    let swalFireSpy: jasmine.Spy;
    let movimentacaoService: any;
    let listarInstituicoesAsyncSpy: jasmine.Spy;

    beforeEach(() => {
      movimentacaoService = TestBed.inject(MovimentacaoService);
      listarInstituicoesAsyncSpy = spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.resolve());
      swalFireSpy = spyOn<any>(Swal, 'fire').and.callThrough();
      spyOn(movimentacaoService, 'DeletarAsync').and.returnValue(Promise.resolve());
    });

    it('should call DeletarAsync and ListarInstituicoesAsync and show success when confirmed', async () => {
      // Simula confirmação positiva
      (Swal.fire as any).and.returnValue(Promise.resolve({ isConfirmed: true }));
      await component.onDeleteMovimentacao('1');
      expect(movimentacaoService.DeletarAsync).toHaveBeenCalledWith('1');
      expect(listarInstituicoesAsyncSpy).toHaveBeenCalledWith(true);
      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
    });

    it('should not call DeletarAsync if not confirmed', async () => {
      (Swal.fire as any).and.returnValue(Promise.resolve({ isConfirmed: false }));
      await component.onDeleteMovimentacao('1');
      expect(movimentacaoService.DeletarAsync).not.toHaveBeenCalled();
      expect(listarInstituicoesAsyncSpy).not.toHaveBeenCalled();
    });

    it('should handle error in DeletarAsync', async () => {
      (Swal.fire as any).and.returnValues(
        Promise.resolve({ isConfirmed: true }),
        Promise.resolve() // para o segundo Swal.fire
      );
      (movimentacaoService.DeletarAsync as any).and.returnValue(Promise.reject({ message: 'erro' }));
      await component.onDeleteMovimentacao('1');
      // O erro é "engolido" pelo then, mas podemos garantir que o Swal de sucesso não é chamado
      expect(swalFireSpy).not.toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
    });

    it('should handle error in ListarInstituicoesAsync after delete', async () => {
      (Swal.fire as any).and.returnValues(
        Promise.resolve({ isConfirmed: true }),
        Promise.resolve() // para o segundo Swal.fire
      );
      (movimentacaoService.DeletarAsync as any).and.returnValue(Promise.resolve());
      listarInstituicoesAsyncSpy.and.returnValue(Promise.reject({ message: 'erro' }));
      await component.onDeleteMovimentacao('1');
      // O Swal de sucesso é chamado antes do erro
      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
    });
  });
});
