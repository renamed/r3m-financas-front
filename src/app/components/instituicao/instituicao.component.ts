import { Component } from '@angular/core';
import InstituicaoResponse from '../../models/instituicao.response';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InstituicoesService } from '../../services/instituicoes.service';
import Swal from 'sweetalert2';
import InstituicaoRequest from '../../models/instituicao.request';

@Component({
  selector: 'app-instituicao',
  imports: [CommonModule, FormsModule, SweetAlert2Module, FontAwesomeModule],
  templateUrl: './instituicao.component.html',
  styleUrl: './instituicao.component.css'
})
export class InstituicaoComponent {

  instituicoes: InstituicaoResponse[] = [];
  novaInstituicao: InstituicaoRequest = {
    nome: '',
    saldo_inicial: 0,
    data_saldo_inicial: new Date(),
    instituicao_credito: false,
    limite_credito: 0
  };

  constructor(private instituicoesService: InstituicoesService) { }

    async ngOnInit() {
      await this.ListarInstituicoesAsync();
    }
    
      async ListarInstituicoesAsync() {
        try {
          const instituicoes_aux = await this.instituicoesService.ListarAsync();
          instituicoes_aux.sort((a, b) => a.nome.localeCompare(b.nome));
          this.instituicoes = instituicoes_aux;

        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao listar instituições',
            html: 'Não foi possível listar as instituições. <p/> ' + error.message,
            allowOutsideClick: false
          });
        }
      }

      async CadastrarInstituicao() {
        try {
          if (this.novaInstituicao.instituicao_credito) {
            this.novaInstituicao.saldo_inicial = -this.novaInstituicao.limite_credito!;
          } else {
            this.novaInstituicao.limite_credito = null;
          }

          await this.instituicoesService.AdicionarAsync(this.novaInstituicao);
          Swal.fire({
            icon: 'success',
            title: 'Instituição cadastrada com sucesso',
            allowOutsideClick: false
          });
          this.novaInstituicao = {
            nome: '',
            saldo_inicial: 0,
            data_saldo_inicial: new Date(),
            instituicao_credito: false,
            limite_credito: 0
          };
          await this.ListarInstituicoesAsync();
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar instituição',
            html: 'Não foi possível cadastrar a instituição. <p/> ' + error.message,
            allowOutsideClick: false
          });
        }
      }

      onValorInput(event: any, field: 'saldo_inicial' | 'limite_credito') {
    let value = event.target.value;

    // Verifica se possui o caractere "-"
    const isNegative = value.trim().includes('-');

    // Remove tudo que não for dígito
    value = value.replace(/[^\d]/g, '');

    if (value.length === 0) value = '0';

    // Converte para float (centavos)
    let floatValue = parseFloat((parseInt(value, 10) / 100).toFixed(2));
    if (isNegative) floatValue = -floatValue;

    // Atualiza o modelo
    this.novaInstituicao[field] = floatValue;

    // Atualiza o input formatado
    const formatted = floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    event.target.value = formatted;
  }
}
