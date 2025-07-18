import { TestBed } from '@angular/core/testing';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoRequest } from '../models/movimentacao.request';

const mockMovimentacoes = [
  { movimentacao_id: '1', valor: 10, data: new Date(), descricao: 'Teste', categoria: { categoria_id: '1', nome: 'Cat' }, instituicao: { instituicao_id: '1', nome: 'Banco', saldo: 100, credito: false, movimentacoes: [] }, periodo: { periodo_id: '1', nome: 'Período', inicio: new Date(), fim: new Date() } }
];

const mockRequest: MovimentacaoRequest = {
  data: new Date(),
  descricao: 'Teste',
  valor: 10,
  categoria_id: '1',
  instituicao_id: '1',
  periodo_id: '1'
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

  it('should call fetch with correct URL and method for AdicionarAsync', async () => {
    const spy = spyOn(window, 'fetch').and.resolveTo({ ok: true } as Response);
    await service.AdicionarAsync(mockRequest);
    expect(spy).toHaveBeenCalledWith(
      'http://localhost:7050/api/movimentacao',
      jasmine.objectContaining({
        method: 'POST',
        headers: jasmine.objectContaining({ 'Content-Type': 'application/json' }),
        body: jasmine.any(String)
      })
    );
  });

  it('should call fetch with correct URL for ListarPorInstituicaoAsync', async () => {
    const spy = spyOn(window, 'fetch').and.resolveTo({ ok: true, json: async () => mockMovimentacoes } as Response);
    await service.ListarPorInstituicaoAsync('1', '1');
    expect(spy).toHaveBeenCalledWith('http://localhost:7050/api/movimentacao/1/1');
  });

  it('should delete movimentacao (DeletarAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: true } as Response);
    await expectAsync(service.DeletarAsync('1')).toBeResolved();
  });

  it('should throw error if DeletarAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.DeletarAsync('1')).toBeRejectedWithError('Erro ao deletar movimentação');
  });

  it('should call fetch with correct URL and method for DeletarAsync', async () => {
    const spy = spyOn(window, 'fetch').and.resolveTo({ ok: true } as Response);
    await service.DeletarAsync('1');
    expect(spy).toHaveBeenCalledWith(
      'http://localhost:7050/api/movimentacao/1',
      jasmine.objectContaining({
        method: 'DELETE'
      })
    );
  });

  it('should throw if fetch throws (network error) in ListarPorInstituicaoAsync', async () => {
    spyOn(window, 'fetch').and.callFake(() => { throw new Error('Network'); });
    await expectAsync(service.ListarPorInstituicaoAsync('1', '1')).toBeRejectedWithError('Network');
  });

  it('should throw if fetch throws (network error) in AdicionarAsync', async () => {
    spyOn(window, 'fetch').and.callFake(() => { throw new Error('Network'); });
    await expectAsync(service.AdicionarAsync(mockRequest)).toBeRejectedWithError('Network');
  });

  it('should throw if fetch throws (network error) in DeletarAsync', async () => {
    spyOn(window, 'fetch').and.callFake(() => { throw new Error('Network'); });
    await expectAsync(service.DeletarAsync('1')).toBeRejectedWithError('Network');
  });
});
