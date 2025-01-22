const cadastrarPessoa = async (dados, supabase, schema) => {
    // Verifica se o supabase está configurado corretamente
    if (!supabase) {
        throw new Error('Supabase não configurado.');
    }

    // Verifica se o schema foi enviado
    if (!schema) {
        throw new Error('Schema não especificado');
    }

    // Utiliza o schema para acessar a tabela correta e inserir os dados
    const { data, error } = await supabase
        .schema(schema)  // Define o schema dinamicamente
        .from('tipo_pessoa')
        .insert([{
            tpp_descricao: dados.descricao,
            tpp_classificacao: dados.classificacao
        }]);

    console.log('Dados recebidos:', dados);

    if (error) {
        console.error('Erro ao cadastrar Tipo pessoa:', error.message);
        return { success: false, error: error.message };
    }

    return { success: true, data };
};

module.exports = { cadastrarPessoa };
