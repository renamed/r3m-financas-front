import { TestBed } from '@angular/core/testing';
import { TipocategoriaService } from './tipocategoria.service';
import TipoCategoriaResponse from '../models/tipo_categoria.response';

describe('TipocategoriaService', () => {
  let service: TipocategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipocategoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call fetch and return data when response is ok', async () => {
    const mockData: TipoCategoriaResponse[] = [
      { tipo_categoria_id: '1', nome: 'Categoria 1' } as TipoCategoriaResponse,
      { tipo_categoria_id: '2', nome: 'Categoria 2' } as TipoCategoriaResponse
    ];

    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await service.ListarAsync();
    expect(fetch).toHaveBeenCalledWith('http://localhost:7050/api/tipocategoria');
    expect(result).toEqual(mockData);
  });

  it('should throw error when response is not ok', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: false
    } as Response);

    await expectAsync(service.ListarAsync()).toBeRejectedWithError('Erro ao listar tipos de categoria');
  });
});
