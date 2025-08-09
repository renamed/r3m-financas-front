import { TestBed } from '@angular/core/testing';
import { CategoriasService } from './categorias.service';
import CategoriaRequest from '../models/categoria.request';

const mockCategorias = [
  { categoria_id: '1', nome: 'Alimentação' },
  { categoria_id: '2', nome: 'Transporte' }
];

describe('CategoriasService', () => {
  let service: CategoriasService;

  beforeEach(() => {
    // Garante que fetch existe para o spy funcionar
    (window as any).fetch = () => Promise.resolve();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriasService);
  });

  afterEach(() => {
    (window as any).fetch = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ListarAsync
  it('should list categories (ListarAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockCategorias
    } as Response);
    const result = await service.ListarAsync();
    expect(result).toEqual(mockCategorias);
  });

  it('should throw error if ListarAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.ListarAsync()).toBeRejectedWithError('Erro ao listar categorias');
  });

  // ListarPorPaiAsync
  it('should list categories by parent (ListarPorPaiAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockCategorias
    } as Response);
    const result = await service.ListarPorPaiAsync('1');
    expect(result).toEqual(mockCategorias);
  });

  it('should throw error if ListarPorPaiAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.ListarPorPaiAsync('1')).toBeRejectedWithError('Erro ao listar categorias por pai');
  });

  // PesquisarAsync
  it('should search categories (PesquisarAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockCategorias
    } as Response);
    const result = await service.PesquisarAsync('ali');
    expect(result).toEqual(mockCategorias);
  });

  it('should throw error if PesquisarAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.PesquisarAsync('ali')).toBeRejectedWithError('Erro ao pesquisar categorias');
  });

  // CriarAsync
  it('should create category (CriarAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true
    } as Response);
    await service.CriarAsync({ nome: 'Nova Categoria' } as CategoriaRequest);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:7050/api/Categoria',
      jasmine.objectContaining({
        method: 'POST',
        headers: jasmine.any(Object),
        body: jasmine.any(String)
      })
    );
  });

  it('should throw error if CriarAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: false,
      text: async () => 'Erro na criação'
    } as Response);
    await expectAsync(service.CriarAsync({ nome: 'Nova' } as CategoriaRequest))
      .toBeRejectedWithError('Erro na criação');
  });

  // DeleteAsync
  it('should delete category (DeleteAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true
    } as Response);
    await service.DeleteAsync('123');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:7050/api/Categoria/123',
      jasmine.objectContaining({
        method: 'DELETE'
      })
    );
  });

  it('should throw error if DeleteAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: false,
      text: async () => 'Erro ao deletar'
    } as Response);
    await expectAsync(service.DeleteAsync('123'))
      .toBeRejectedWithError('Erro ao deletar');
  });
});
