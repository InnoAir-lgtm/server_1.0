const express = require('express');
const router = express.Router();
const { cadastrarEndereco } = require('../controllers/CadastrarEnder');
const supabase = require('../Supabase/supabaseClient');

router.post('/cadastrar-endereco', async (req, res) => {
    const { schema, ...dados } = req.body;

    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }

    try {
        const result = await cadastrarEndereco(dados, supabase, schema);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json({ message: 'Endereço cadastrado com sucesso!', data: result.data });
    } catch (error) {
        console.error('Erro ao cadastrar endereço:', error);
        res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
    }
});

router.get('/listar-enderecos', async (req, res) => {
    const schema = req.query.schema;
    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }
    try {
        const { data, error } = await supabase
            .schema(schema)
            .from('enderecos')
            .select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Endereços listados com sucesso!', data });
    } catch (error) {
        console.error('Erro ao listar endereços:', error);
        res.status(500).json({ error: 'Erro ao listar endereços.' });
    }
});


module.exports = router