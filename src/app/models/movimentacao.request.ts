export class MovimentacaoRequest {
    data: Date;
    descricao: string;
    valor: number | null;
    categoria_id: string;
    instituicao_id: string;
    periodo_id: string;

    constructor(data: Date, descricao: string, valor: number, categoria_id: string, instituicao_id: string, periodo_id: string) {
        this.data = data;
        this.descricao = descricao;
        this.valor = valor;
        this.categoria_id = categoria_id;
        this.instituicao_id = instituicao_id;
        this.periodo_id = periodo_id;
    }
}