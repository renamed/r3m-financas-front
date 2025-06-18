import { TestBed } from '@angular/core/testing';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoRequest } from '../models/movimentacao.request';

const mockMovimentacoes = [
  { movimentacaoId: '1', valor: 10, data: new Date(), descricao: 'Teste', categoria: { categoriaId: '1', nome: 'Cat' }, instituicao: { instituicaoId: '1', nome: 'Banco', saldo: 100, credito: false, movimentacoes: [] }, periodo: { periodoId: '1', nome: 'Período', inicio: new Date(), fim: new Date() } }
];

const mockRequest: MovimentacaoRequest = {
  data: new Date(),
  descricao: 'Teste',
  valor: 10,
  categoriaId: '1',
  instituicaoId: '1',
  periodoId: '1'
};

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;

  beforeEach(() => {
    (window as any).fetch = () => Promise.resolve();
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimentacaoService);
  });

  afterEach(() => {
    (window as any).fetch = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list movimentacoes by instituicao (ListarPorInstituicaoAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockMovimentacoes
    } as Response);
    const result = await service.ListarPorInstituicaoAsync('1', '1');
    expect(result).toEqual(mockMovimentacoes);
  });

  it('should throw error if ListarPorInstituicaoAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.ListarPorInstituicaoAsync('1', '1')).toBeRejectedWithError('Erro ao listar períodos');
  });

  it('should add movimentacao (AdicionarAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: true } as Response);
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeResolved();
  });

  it('should throw error if AdicionarAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeRejectedWithError('Erro ao adicionar movimentação');
  });
});
