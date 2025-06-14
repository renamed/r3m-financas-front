import { TestBed } from '@angular/core/testing';
import { PeriodosService } from './periodos.service';

const mockPeriodos = [
  { periodoId: '1', nome: 'Janeiro', inicio: new Date('2025-01-01'), fim: new Date('2025-01-31') },
  { periodoId: '2', nome: 'Fevereiro', inicio: new Date('2025-02-01'), fim: new Date('2025-02-28') }
];

describe('PeriodosService', () => {
  let service: PeriodosService;

  beforeEach(() => {
    (window as any).fetch = () => Promise.resolve();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodosService);
  });

  afterEach(() => {
    (window as any).fetch = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list periods (ListarAsync)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: async () => mockPeriodos
    } as Response);
    const result = await service.ListarAsync(2025);
    expect(result).toEqual(mockPeriodos);
  });

  it('should throw error if ListarAsync fails', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false } as Response);
    await expectAsync(service.ListarAsync(2025)).toBeRejectedWithError('Erro ao listar períodos');
  });
});
