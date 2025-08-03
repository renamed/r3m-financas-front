import { ComponentFixture, TestBed } from '@angular/core/testing';
import Swal from 'sweetalert2';

import { InstituicaoComponent } from './instituicao.component';

describe('InstituicaoComponent', () => {
  let component: InstituicaoComponent;
  let fixture: ComponentFixture<InstituicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call ListarInstituicoesAsync on ngOnInit', async () => {
    const spy = spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.resolve());
    await component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should list institutions and sort by name', async () => {
    const mockInstituicoes = [
      { nome: 'Banco B' },
      { nome: 'Banco A' }
    ];
    spyOn(component['instituicoesService'], 'ListarAsync').and.resolveTo(mockInstituicoes as any);
    await component.ListarInstituicoesAsync();
    expect(component.instituicoes[0].nome).toBe('Banco A');
    expect(component.instituicoes[1].nome).toBe('Banco B');
  });

  it('should show error alert if ListarInstituicoesAsync fails', async () => {
    spyOn(component['instituicoesService'], 'ListarAsync').and.rejectWith(new Error('Falha'));
    const swalSpy = spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
    await component.ListarInstituicoesAsync();
    expect(swalSpy).toHaveBeenCalled();
  });

  it('should set saldo_inicial negative if instituicao_credito is true on CadastrarInstituicao', async () => {
    const adicionarSpy = spyOn(component['instituicoesService'], 'AdicionarAsync').and.resolveTo();
    const swalSpy = spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
    component.novaInstituicao = {
      nome: 'Banco X',
      saldo_inicial: 100,
      data_saldo_inicial: new Date(),
      instituicao_credito: true,
      limite_credito: 200
    };
    const listarSpy = spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.resolve());
    await component.CadastrarInstituicao();
    expect(adicionarSpy).toHaveBeenCalledWith(jasmine.objectContaining({ saldo_inicial: -200 }));
    expect(swalSpy).toHaveBeenCalled();
    expect(listarSpy).toHaveBeenCalled();
  });

  it('should set limite_credito null if instituicao_credito is false on CadastrarInstituicao', async () => {
    spyOn(component['instituicoesService'], 'AdicionarAsync').and.resolveTo();
    const swalSpy = spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
    component.novaInstituicao = {
      nome: 'Banco Y',
      saldo_inicial: 100,
      data_saldo_inicial: new Date(),
      instituicao_credito: false,
      limite_credito: 200
    };
    const listarSpy = spyOn(component, 'ListarInstituicoesAsync').and.returnValue(Promise.resolve());
    await component.CadastrarInstituicao();
    expect(component.novaInstituicao.limite_credito).toBe(0);
    expect(swalSpy).toHaveBeenCalled();
    expect(listarSpy).toHaveBeenCalled();
  });

  it('should show error alert if CadastrarInstituicao fails', async () => {
    spyOn(component['instituicoesService'], 'AdicionarAsync').and.rejectWith(new Error('Falha cadastro'));
    const swalSpy = spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
    await component.CadastrarInstituicao();
    expect(swalSpy).toHaveBeenCalled();
  });

  it('should format and update saldo_inicial onValorInput', () => {
    const event = { target: { value: '12345' } };
    component.onValorInput(event as any, 'saldo_inicial');
    expect(component.novaInstituicao.saldo_inicial).toBe(123.45);
    expect(event.target.value).toContain('R$');
  });

  it('should format and update limite_credito onValorInput with negative value', () => {
    const event = { target: { value: '-9876' } };
    component.onValorInput(event as any, 'limite_credito');
    expect(component.novaInstituicao.limite_credito).toBe(-98.76);
    expect(event.target.value).toContain('R$');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
