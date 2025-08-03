import { TestBed } from '@angular/core/testing';
import { InstituicoesService } from './instituicoes.service';

const mockInstituicoes = [
  { instituicao_id: '1', nome: 'Banco A', saldo: 100, credito: false, movimentacoes: [] },
  { instituicao_id: '2', nome: 'Banco B', saldo: 200, credito: false, movimentacoes: [] }
];

describe('InstituicoesService', () => {
  let service: InstituicoesService;

  beforeEach(() => {
    (window as any).fetch = () => Promise.resolve();
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituicoesService);
  });

  afterEach(() => {
    (window as any).fetch = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list institutions (ListarAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockInstituicoes
    } as Response);
    const result = await service.ListarAsync();
    expect(result).toEqual(mockInstituicoes);
  });

  it('should throw error if ListarAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.ListarAsync()).toBeRejectedWithError('Erro ao listar instituições');
  });
  it('should add institution (AdicionarAsync)', async () => {
    const mockRequest = {
      nome: 'Banco C',
      saldo_inicial: 300,
      data_saldo_inicial: new Date('2025-01-01'),
      instituicao_credito: true
    };
    spyOn(window, 'fetch').and.resolveTo({ ok: true } as Response);
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeResolved();
  });

  it('should send correct headers and body in AdicionarAsync', async () => {
    const mockRequest = {
      nome: 'Banco F',
      saldo_inicial: 600,
      data_saldo_inicial: new Date('2025-02-01'),
      instituicao_credito: false
    };
    const fetchSpy = spyOn(window, 'fetch').and.callFake((url, options) => {
      expect(url).toBe('http://localhost:7050/api/instituicao');
      expect(options).toBeDefined();
      expect(options?.method).toBe('POST');
      expect(options?.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(options?.body).toBe(JSON.stringify(mockRequest));
      return Promise.resolve({ ok: true } as Response);
    });
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeResolved();
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should return array of InstituicaoResponse from ListarAsync', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockInstituicoes
    } as Response);
    const result = await service.ListarAsync();
    expect(Array.isArray(result)).toBeTrue();
    expect(result.length).toBe(mockInstituicoes.length);
    expect(result[0].nome).toBe('Banco A');
  });

  it('should throw error if fetch throws in ListarAsync', async () => {
    spyOn(window, 'fetch').and.callFake(() => { throw new Error('Network error'); });
    await expectAsync(service.ListarAsync()).toBeRejectedWithError('Network error');
  });

  it('should throw error if fetch throws in AdicionarAsync', async () => {
    const mockRequest = {
      nome: 'Banco G',
      saldo_inicial: 700,
      data_saldo_inicial: new Date('2025-03-01'),
      instituicao_credito: true
    };
    spyOn(window, 'fetch').and.callFake(() => { throw new Error('Network error'); });
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeRejectedWithError('Network error');
  });
  it('should throw error if AdicionarAsync fails with message', async () => {
    const mockRequest = {
      nome: 'Banco D',
      saldo_inicial: 400,
      data_saldo_inicial: new Date('2025-01-01'),
      instituicao_credito: false
    };
    spyOn(window, 'fetch').and.resolveTo({
      ok: false,
      text: async () => 'Erro customizado'
    } as Response);
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeRejectedWithError('Erro customizado');
  });

  it('should throw error if AdicionarAsync fails with empty message', async () => {
    const mockRequest = {
      nome: 'Banco E',
      saldo_inicial: 500,
      data_saldo_inicial: new Date('2025-01-01'),
      instituicao_credito: true
    };
    spyOn(window, 'fetch').and.resolveTo({
      ok: false,
      text: async () => ''
    } as Response);
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeRejectedWithError('Erro ao adicionar instituição');
  });
});
