export class MovimentacaoRequest {
    data: Date;
    descricao: string;
    valor: number | null;
    categoriaId: string;
    instituicaoId: string;
    periodoId: string;

    constructor(data: Date, descricao: string, valor: number, categoriaId: string, instituicaoId: string, periodoId: string) {
        this.data = data;
        this.descricao = descricao;
        this.valor = valor;
        this.categoriaId = categoriaId;
        this.instituicaoId = instituicaoId;
        this.periodoId = periodoId;
    }
}