const associarTpPe = async (dados, supabase) => {
    if (!supabase) {
        console.error('Supabase não configurado.');
        throw new Error('Supabase não configurado.');
    }

    // Verificar os dados recebidos
    console.log('Pes ID:', dados.pes_id, 'Selected Tipo:', dados.selectedTipo);

    // Inserir na tabela pessoas_tipo
    const { data, error } = await supabase
        .schema('belaarte') // Verifique se o schema está correto
        .from('pessoas_tipo') // Verifique o nome da tabela
        .insert([{
            pes_id: dados.pes_id, 
            tpp_id: dados.tpp_id
        }]);


    return { success: true, data };
};

module.exports = { associarTpPe };
