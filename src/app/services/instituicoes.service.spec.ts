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
});
