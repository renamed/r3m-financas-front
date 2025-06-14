import { TestBed } from '@angular/core/testing';
import { CategoriasService } from './categorias.service';

const mockCategorias = [
  { categoriaId: '1', nome: 'Alimentação' },
  { categoriaId: '2', nome: 'Transporte' }
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
});
