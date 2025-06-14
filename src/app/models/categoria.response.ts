export default interface CategoryResponse {
    categoriaId: string;
    nome: string;
    parent_id?: string | null;
}