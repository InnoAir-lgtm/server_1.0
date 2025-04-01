async function registrarProcedencia(dados, supabase, schema) {
    if (!supabase) {
        throw new Error('SP NOT CONFIGURED')
    }

    const { data, error } = await supabase
        .schema(schema)
        .from('procedencia')
        .insert([{
            pcd_procedencia: dados.procedencia,
        }]);

    if (error) {
        console.log('Error ao cadastrar tipo produto', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, data }
}

module.exports = { registrarProcedencia }
