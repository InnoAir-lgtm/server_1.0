const associarTpPe = async (dados, supabase) => {
    if (!supabase) {
        console.error('Supabase não configurado.');
        throw new Error('Supabase não configurado.');
    }

   
    console.log('Pes ID:', dados.pes_id, 'Selected Tipo:', dados.tpp_id);

 
    const { data, error } = await supabase
        .schema('belaarte') 
        .from('pessoas_tipo')
        .insert([{
            pes_id: dados.pes_id, 
            tpp_id: dados.tpp_id
        }]);


    return { success: true, data };
};

module.exports = { associarTpPe };