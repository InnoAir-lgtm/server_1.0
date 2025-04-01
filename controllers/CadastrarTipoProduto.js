async function cadastrarTipoProduto(dados, supabase, schema) {
    if (!supabase) {
        throw new Error('SP NOT CONFIGURED')
    }

    const { data, error } = await supabase
        .schema(schema)
        .from('tipo_produto')
        .insert([{
            tpp_descricao: dados.descricao,
        }]);

    if (error) {
        console.log('Error ao cadastrar tipo produto', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, data }
}

module.exports = { cadastrarTipoProduto }
