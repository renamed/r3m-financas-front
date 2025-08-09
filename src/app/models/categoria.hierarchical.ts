export default interface CategoryHierarchical {
    categoria_id: string;
    nome: string;
    parent_id?: string | null;

    filhos: CategoryHierarchical[];
}