require('dotenv').config();
const express = require('express');
const router = express.Router();
const { cadastrarTipoProduto } = require('../controllers/CadastrarTipoProduto');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const { createClient } = require('@supabase/supabase-js');
const supabase = require('../Supabase/supabaseClient');

router.post('/cadastrar-tipo-produto', async (req, res) => {
    const { schema, ...dados } = req.body;
    if (!schema) {
        return res.status(400).json({ error: 'Schema é obrigatório' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
        const result = await cadastrarTipoProduto(dados, supabase, schema);

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

router.get('/listar-tipo-produto', async (req, res) => {
    const schema = req.query.schema
    if (!schema) {
        return res.status(400).json({ erro: 'schema não especificado.' })
    }
    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('tipo_produto')
            .select('*')
        if (error) {
            return res.status(400).json({ error: error.message })
        }
        res.status(200).json({ message: 'Tipo listado', data })
    } catch (error) {
        console.error('Erro ao listar Tipo:', error);
        res.status(500).json({ error: 'Erro ao listar tipo.' });
    }
})


router.delete('/deletar-tipo-produto/:id', async (req, res) => {
    const { id } = req.params;
    const schema = req.query.schema;

    if (!schema) {
        return res.status(400).json({ error: 'Schema é obrigatório' });
    }

    try {
        const { error } = await supabase
            .schema(schema)
            .from('tipo_produto')
            .delete()
            .eq('tpp_id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json({ message: 'Tipo de produto deletado com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar tipo de produto:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});


module.exports = router;
