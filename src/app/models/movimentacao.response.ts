import CategoryResponse from "./categoria.response";
import InstituicaoResponse from "./instituicao.response";
import PeriodoResponse from "./periodo.response";

export default interface MovimentacaoResponse {
    movimentacao_id: string;
    data: Date;
    descricao: string;
    valor: number;    
    categoria: CategoryResponse;
    instituicao: InstituicaoResponse;
    periodo: PeriodoResponse;
}