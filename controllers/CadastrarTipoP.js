const cadastrarPessoa = async (dados, supabase) => {
    if (!supabase) {
        throw new Error('Supabase não configurado.');
    }

    if (!schema) {
        throw new Error('Schema not specified');
    }

    const { data, error } = await supabase
        .schema(schema)
        .from('tipo_pessoa')
        .insert([{
            tpp_descricao: dados.descricao, 
            tpp_classificacao: dados.classificacao
        }]);
        console.log('Dados recebidos:', dados);


    if (error) {
        console.error('Erro ao cadastrar Tipo pessoa:', error.message);
        return { success: false, error };
    }
    return { success: true, data };
};

module.exports = { cadastrarPessoa };
