async function cadastrarEndereco(dados, supabase, schema) {
    if (!supabase) {
        throw new Error('BD not configured');
    }
    if (!schema) {
        throw new Error('Schema not specified');
    }
    const { data, error } = await supabase
        .schema(schema)
        .from('enderecos')
        .insert([
            {
                end_cep: dados.cep,
                end_logradouro: dados.logradouro,
                end_bairro: dados.bairro,
                end_cidade: dados.cidade,
                end_uf: dados.uf, // CORRETO
            }
        ]);

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data };
}

module.exports = { cadastrarEndereco };