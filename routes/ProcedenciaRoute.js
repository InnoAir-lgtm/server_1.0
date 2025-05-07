require('dotenv').config(); // Para garantir que o arquivo .env seja carregado
const express = require('express');
const router = express.Router();
const { registrarProcedencia } = require('../controllers/RegistrarProced');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const { createClient } = require('@supabase/supabase-js');

router.post('/cadastrar-procedencia', async (req, res) => {
    const { schema, ...dados } = req.body;
    if (!schema) {
        return res.status(400).json({ error: 'Schema é obrigatório' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
        const result = await registrarProcedencia(dados, supabase, schema);

        if (result.success) {
            return res.status(201).json({ message: 'Tipo de produto cadastrado com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar tipo de produto', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


router.get('/procedencias', async (req, res) => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { schema } = req.query; 

    if (!schema) {
        return res.status(400).json({ error: 'Schema é obrigatório' });
    }

    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('procedencia')    
            .select('*')            
    
        if (error) {
            console.error('Erro ao buscar procedências:', error.message);
            return res.status(400).json({ message: 'Erro ao buscar procedências', error: error.message });
        }

        return res.status(200).json({ procedencias: data });
    } catch (error) {
        console.error('Erro interno ao buscar procedências:', error.message);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


router.delete('/procedencias/:id', async (req, res) => {
    const { schema } = req.query;
    const { id } = req.params;

    if (!schema) {
        return res.status(400).json({ error: 'Schema é obrigatório' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { error } = await supabase
            .schema(schema)
            .from('procedencia')
            .delete()
            .eq('pcd_id', id); // Considerando que o ID do registro é armazenado como "pcd_id"

        if (error) {
            console.error('Erro ao deletar procedência:', error.message);
            return res.status(400).json({ message: 'Erro ao deletar procedência', error: error.message });
        }

        return res.status(200).json({ message: 'Procedência deletada com sucesso!' });
    } catch (error) {
        console.error('Erro interno ao deletar procedência:', error.message);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});




module.exports = router;
