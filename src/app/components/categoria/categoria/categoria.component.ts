import { Component, ElementRef, ViewChild } from '@angular/core';
import CategoryResponse from '../../../models/categoria.response';
import { CategoriasService } from '../../../services/categorias.service';
import Swal from 'sweetalert2';
import CategoryHierarchical from '../../../models/categoria.hierarchical';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import CategoriaRequest from '../../../models/categoria.request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import TipoCategoriaResponse from '../../../models/tipo_categoria.response';
import { TipocategoriaService } from '../../../services/tipocategoria.service';

@Component({
  selector: 'app-categoria',
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  categorias: CategoryHierarchical[] = [];
  tiposCategoria: TipoCategoriaResponse[] = [];
  nova_categoria_pai_nome: string = '';
  novaCategoria: CategoriaRequest = {
    nome: ''
  };
  @ViewChild('inputNome') inputNome!: ElementRef<HTMLInputElement>;

  faPlus = faPlus;
  faTrash = faTrash;

  constructor(private categoriasService: CategoriasService
    , private sanitizer: DomSanitizer
    , private tipoCategoriaService: TipocategoriaService
  ) { }

  async onSubmit() {
    try {
      await this.categoriasService.CriarAsync(this.novaCategoria);
      await this.ListarCategoriasAsync();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao adicionar categoria',
        html: 'Não foi possível adicionar a categoria. <p/> ' + error.message,
        allowOutsideClick: false
      });
      return;
    }
  }

  async delete(id: string, nome: string) {

    Swal.fire({
      title: 'Deletar categoria',
      text: `Você tem certeza que deseja deletar a categoria ${nome}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.categoriasService.DeleteAsync(id);
          await this.ListarCategoriasAsync();
          Swal.fire({
            icon: 'success',
            title: 'Categoria deletada',
            text: 'A categoria foi deletada com sucesso.',
            allowOutsideClick: false
          });
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao deletar categoria',
            html: 'Não foi possível deletar a categoria. <p/> ' + error.message,
            allowOutsideClick: false
          });
        }
      }
    });
  }
      

  setPaiNovaCategoria(pai_id: string, nome: string) {
      this.nova_categoria_pai_nome = nome;
      this.novaCategoria.parent_id = pai_id;

      this.inputNome.nativeElement.focus();
    }


  async ngOnInit() {
      await this.ListarCategoriasAsync();
      await this.ListarTipoCategoriasAsync();
    }

  async ListarTipoCategoriasAsync() {
      this.tiposCategoria = await this.tipoCategoriaService.ListarAsync();
    }

  async ListarCategoriasAsync() {
      try {
        const categorias_aux = await this.categoriasService.ListarAsync();
        this.categorias = this.ConverterParaHierarquico(categorias_aux, null);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar categorias',
          html: 'Não foi possível carregar as categorias. <p/> ' + error.message,
          allowOutsideClick: false
        });
      }
    }

    ConverterParaHierarquico(categorias: CategoryResponse[], pai: string | null): CategoryHierarchical[] {
      const response: CategoryHierarchical[] = [];

      const categorias_filter = pai
        ? categorias.filter(c => c.parent_id === pai)
        : categorias.filter(c => !c.parent_id);

      categorias_filter.forEach(element => {
        const cat_hierarchy: CategoryHierarchical = {
          categoria_id: element.categoria_id,
          nome: element.nome.split('->').pop()!,
          parent_id: element.parent_id,

          filhos: this.ConverterParaHierarquico(categorias, element.categoria_id)
        };

        response.push(cat_hierarchy);
      });

      return response;
    }

  async adicionarSubcategoria(categoriaPai: CategoryHierarchical) {
      const { value: novaCategoria } = await Swal.fire({
        title: 'Adicionar Subcategoria',
        input: 'text',
        inputLabel: 'Nome da subcategoria',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Você precisa escrever um nome para a subcategoria!';
          }
          return null;
        }
      });

      if (novaCategoria) {
        try {
          const novaSubcategoria: CategoryResponse = {
            categoria_id: '', // será preenchido pelo backend
            nome: novaCategoria,
            parent_id: categoriaPai.categoria_id
          };

          await this.categoriasService.CriarAsync(novaSubcategoria);
          await this.ListarCategoriasAsync(); // Recarrega a lista

          Swal.fire({
            icon: 'success',
            title: 'Subcategoria adicionada com sucesso!',
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao adicionar subcategoria',
            html: 'Não foi possível adicionar a subcategoria. <p/> ' + error.message,
            allowOutsideClick: false
          });
        }
      }
    }
  }
