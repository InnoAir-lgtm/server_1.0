async function CadastrarEmpreendimento(dados, supabase, schema) {
    console.log(dados);
    if (!supabase) {
        throw new Error('BD not configured');
    }

    const {data, error} = await supabase
    .schema(schema)
    .from('empreendimentos')
    .insert([
        {
            end_cep: dados.cep,
            epd_numero: dados.numero,
            epd_nome: dados.nome,
            epd_complemento: dados.complemento,
            pes_id_arquiteto: dados.arquiteto,
            epd_construtora: dados.construtora,
            epd_responsavel: dados.responsavel,
            epd_engenheiro: dados.engenheiro,
        }
    ])

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

module.exports = { CadastrarEmpreendimento }