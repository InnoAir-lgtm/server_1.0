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

module.exports = router;
