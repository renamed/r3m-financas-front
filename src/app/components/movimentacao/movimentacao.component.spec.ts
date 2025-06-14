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

// Mocks com tipos corretos
const mockCategorias: CategoryResponse[] = [
  { categoriaId: '1', nome: 'Alimentação' },
  { categoriaId: '2', nome: 'Transporte' }
];
const mockPeriodos: PeriodoResponse[] = [
  { periodoId: '1', nome: 'Janeiro', inicio: new Date('2025-01-01'), fim: new Date('2025-01-31') },
  { periodoId: '2', nome: 'Fevereiro', inicio: new Date('2025-02-01'), fim: new Date('2025-02-28') }
];

const mockInstituicoes: InstituicaoResponse[] = [
  {
    instituicaoId: '1',
    nome: 'Banco A',
    saldo: 100,
    credito: false,
    movimentacoes: [] as MovimentacaoResponse[]
  },
  {
    instituicaoId: '2',
    nome: 'Banco B',
    saldo: 200,
    credito: false,
    movimentacoes: [] as MovimentacaoResponse[]
  }
];

const mockMovimentacoes: MovimentacaoResponse[] = [
  { movimentacaoId: 'm1', valor: 10, data: new Date('2025-01-01'), descricao: 'Teste 1', categoria: mockCategorias[0], instituicao: undefined as any, periodo: mockPeriodos[0] },
  { movimentacaoId: 'm2', valor: -5, data: new Date('2025-01-02'), descricao: 'Teste 2', categoria: mockCategorias[1], instituicao: undefined as any, periodo: mockPeriodos[1] }
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
    const spy = spyOn(console, 'error');
    await component.ListarCategorias();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle error in ListarPeriodosAsync', async () => {
    periodosService.ListarAsync.and.returnValue(Promise.reject('erro'));
    const spy = spyOn(console, 'error');
    await component.ListarPeriodosAsync();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle error in ListarInstituicoesAsync', async () => {
    instituicoesService.ListarAsync.and.returnValue(Promise.reject('erro'));
    const spy = spyOn(console, 'error');
    await component.ListarInstituicoesAsync();
    expect(spy).toHaveBeenCalled();
  });

  it('should call ListarUltimasMovimentacoesPorInstituicaoAsync and sort', async () => {
    movimentacaoService.ListarPorInstituicaoAsync.and.returnValue(Promise.resolve([...mockMovimentacoes]));
    const result = await component.ListarUltimasMovimentacoesPorInstituicaoAsync('1');
    expect(result.length).toBe(2);
  });

  it('should call onDataChange and set periodoId', () => {
    component.periodos = [...mockPeriodos];
    const event = { target: { value: '2025-01-15' } } as any;
    component.movimentacao.periodoId = '';
    component.onDataChange(event);
    expect(component.movimentacao.periodoId).toBe('1');
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
    movimentacaoService.AdicionarAsync.and.returnValue(Promise.reject('erro'));
    spyOn(window, 'alert');
    await component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('erro');
  });
});
