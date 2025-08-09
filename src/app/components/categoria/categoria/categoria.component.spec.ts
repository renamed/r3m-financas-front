import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaComponent } from './categoria.component';
import { CategoriasService } from '../../../services/categorias.service';
import { TipocategoriaService } from '../../../services/tipocategoria.service';
import Swal from 'sweetalert2';
import { of } from 'rxjs';

describe('CategoriaComponent', () => {
  let component: CategoriaComponent;
  let fixture: ComponentFixture<CategoriaComponent>;
  let categoriasServiceSpy: jasmine.SpyObj<CategoriasService>;
  let tipoCategoriaServiceSpy: jasmine.SpyObj<TipocategoriaService>;

  beforeEach(async () => {
    categoriasServiceSpy = jasmine.createSpyObj('CategoriasService', [
      'CriarAsync',
      'DeleteAsync',
      'ListarAsync'
    ]);
    tipoCategoriaServiceSpy = jasmine.createSpyObj('TipocategoriaService', [
      'ListarAsync'
    ]);

    await TestBed.configureTestingModule({
      imports: [CategoriaComponent],
      providers: [
        { provide: CategoriasService, useValue: categoriasServiceSpy },
        { provide: TipocategoriaService, useValue: tipoCategoriaServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaComponent);
    component = fixture.componentInstance;

    // Mock do ViewChild
    component.inputNome = {
      nativeElement: { focus: jasmine.createSpy('focus') }
    } as any;

    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({} as any));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit - sucesso', async () => {
    categoriasServiceSpy.CriarAsync.and.resolveTo();
    spyOn(component, 'ListarCategoriasAsync').and.resolveTo();
    await component.onSubmit();
    expect(categoriasServiceSpy.CriarAsync).toHaveBeenCalled();
    expect(component.ListarCategoriasAsync).toHaveBeenCalled();
  });

  it('onSubmit - erro', async () => {
    categoriasServiceSpy.CriarAsync.and.rejectWith(new Error('falha'));
    await component.onSubmit();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('delete - cancela', async () => {
    (Swal.fire as jasmine.Spy).and.returnValue(Promise.resolve({ isConfirmed: false }));
    await component.delete('1', 'Teste');
    expect(categoriasServiceSpy.DeleteAsync).not.toHaveBeenCalled();
  });

  // it('delete - confirma sucesso', async () => {
  //   (Swal.fire as jasmine.Spy).and.returnValues(
  //     Promise.resolve({ isConfirmed: true }), // confirmação
  //     Promise.resolve({}) // sucesso
  //   );
  //   categoriasServiceSpy.DeleteAsync.and.resolveTo();
  //   spyOn(component, 'ListarCategoriasAsync').and.resolveTo();
  //   await component.delete('1', 'Teste');
  //   expect(categoriasServiceSpy.DeleteAsync).toHaveBeenCalledWith('1');
  //   expect(component.ListarCategoriasAsync).toHaveBeenCalled();
  // });

  it('delete - confirma sucesso', async () => {
  (Swal.fire as jasmine.Spy).and.returnValues(
    Promise.resolve({ isConfirmed: true }), // confirmação
    Promise.resolve({}) // sucesso
  );
  categoriasServiceSpy.DeleteAsync.and.resolveTo();
  spyOn(component, 'ListarCategoriasAsync').and.resolveTo();

  await component.delete('1', 'Teste');
  await fixture.whenStable(); // aguarda promises internas

  expect(categoriasServiceSpy.DeleteAsync).toHaveBeenCalledWith('1');
  expect(component.ListarCategoriasAsync).toHaveBeenCalled();
});


  it('delete - confirma erro', async () => {
    (Swal.fire as jasmine.Spy).and.returnValues(
      Promise.resolve({ isConfirmed: true }),
      Promise.resolve({})
    );
    categoriasServiceSpy.DeleteAsync.and.rejectWith(new Error('erro delete'));
    await component.delete('1', 'Teste');
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('setPaiNovaCategoria', () => {
    component.setPaiNovaCategoria('pai123', 'Nome Pai');
    expect(component.nova_categoria_pai_nome).toBe('Nome Pai');
    expect(component.novaCategoria.parent_id).toBe('pai123');
    expect(component.inputNome.nativeElement.focus).toHaveBeenCalled();
  });

  it('ngOnInit chama métodos', async () => {
    spyOn(component, 'ListarCategoriasAsync').and.resolveTo();
    spyOn(component, 'ListarTipoCategoriasAsync').and.resolveTo();
    await component.ngOnInit();
    expect(component.ListarCategoriasAsync).toHaveBeenCalled();
    expect(component.ListarTipoCategoriasAsync).toHaveBeenCalled();
  });

  it('ListarTipoCategoriasAsync atribui tipos', async () => {
    const tipos = [{ id: '1', nome: 'Tipo 1' }];
    tipoCategoriaServiceSpy.ListarAsync.and.resolveTo(tipos as any);
    await component.ListarTipoCategoriasAsync();
    expect(component.tiposCategoria).toEqual(tipos as any);
  });

  it('ListarCategoriasAsync - sucesso', async () => {
    categoriasServiceSpy.ListarAsync.and.resolveTo([{ categoria_id: '1', nome: 'Cat', parent_id: null }]);
    spyOn(component, 'ConverterParaHierarquico').and.returnValue([]);
    await component.ListarCategoriasAsync();
    expect(component.ConverterParaHierarquico).toHaveBeenCalled();
  });

  it('ListarCategoriasAsync - erro', async () => {
    categoriasServiceSpy.ListarAsync.and.rejectWith(new Error('erro'));
    await component.ListarCategoriasAsync();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('ConverterParaHierarquico - monta hierarquia', () => {
    const categorias = [
      { categoria_id: '1', nome: 'Pai', parent_id: null },
      { categoria_id: '2', nome: 'Pai->Filho', parent_id: '1' }
    ];
    const res = component.ConverterParaHierarquico(categorias as any, null);
    expect(res.length).toBe(1);
    expect(res[0].filhos.length).toBe(1);
  });

  it('adicionarSubcategoria - cancela', async () => {
    (Swal.fire as jasmine.Spy).and.returnValue(Promise.resolve({ value: '' }));
    await component.adicionarSubcategoria({} as any);
    expect(categoriasServiceSpy.CriarAsync).not.toHaveBeenCalled();
  });

  it('adicionarSubcategoria - sucesso', async () => {
    (Swal.fire as jasmine.Spy).and.returnValues(
      Promise.resolve({ value: 'Nova Sub' }), // input
      Promise.resolve({}) // sucesso
    );
    categoriasServiceSpy.CriarAsync.and.resolveTo();
    spyOn(component, 'ListarCategoriasAsync').and.resolveTo();
    await component.adicionarSubcategoria({ categoria_id: '1', nome: 'Pai', filhos: [] } as any);
    expect(categoriasServiceSpy.CriarAsync).toHaveBeenCalled();
    expect(component.ListarCategoriasAsync).toHaveBeenCalled();
  });

  it('adicionarSubcategoria - erro', async () => {
    (Swal.fire as jasmine.Spy).and.returnValues(
      Promise.resolve({ value: 'Nova Sub' }),
      Promise.resolve({})
    );
    categoriasServiceSpy.CriarAsync.and.rejectWith(new Error('erro'));
    await component.adicionarSubcategoria({ categoria_id: '1', nome: 'Pai', filhos: [] } as any);
    expect(Swal.fire).toHaveBeenCalled();
  });
});
