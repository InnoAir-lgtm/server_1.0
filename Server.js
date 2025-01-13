const express = require('express');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
const { createClient } = require('@supabase/supabase-js');
const { cadastrarEmpresa } = require('./controllers/CadastrarEmp');
const { cadastrarUsuario } = require('./controllers/CadastrarUser')
const { cadastrarPapeis } = require('./controllers/CadastrarPapeis');
const { cadastrarPermissoes } = require('./controllers/CadastrarPermis');
const { cadastrarPessoa } = require('./controllers/CadastrarTipoP')
const { cadastrarPessoaC } = require('./controllers/CadastrarPessoa')
const { cadastrarEndereco } = require('./controllers/CadastrarEnder');
const { associarTpPe } = require('./controllers/AssociarTpPe');

require('dotenv').config();
app.use(express.json());


const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://interface-3-1.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.options('*', cors(corsOptions)); // Configuração para pré-solicitações (OPTIONS)
app.use(cors(corsOptions));


// Chave e conexão BD
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


app.post('/cadastrar-empresa', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarEmpresa(dados, supabase);
        if (result) {
            return res.status(201).json({ message: 'Empresa cadastrada com sucesso!', data: result });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar empresa.' });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


app.post('/cadastrar-papeis', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarPapeis(dados, supabase);
        if (result) {
            return res.status(201).json({ message: 'Papel cadastrada com sucesso!', data: result });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar Papel.' });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
})


app.post('/cadastrar-permissoes', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarPermissoes(dados, supabase);
        if (result.success) {
            return res.status(201).json({ message: 'Permissão cadastrada com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar permissão.', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/cadastrar-endereco', async (req, res) => {
    try {
        const result = await cadastrarEndereco(req.body, supabase);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro ao cadastrar endereço.' });
    }
});

app.post('/cadastrar-pessoa', async (req, res) => {
    const { schema, ...dados } = req.body;

    if (!schema) {
        return res.status(400).json({ error: 'Schema não especificado.' });
    }

    try {
        const result = await cadastrarPessoaC(dados, supabase, schema);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json({ message: 'Pessoa cadastrada com sucesso!', data: result.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar pessoa.' });
    }
});




app.post('/cadastrar-usuario', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarUsuario(dados, supabase);
        if (result.success) {
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar usuário.', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// Corrigir esse error
app.post('/cadastrar-tipo-pessoa', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarPessoa(dados, supabase);

        if (result.success) {
            return res.status(201).json({ message: 'Tipo de pessoa cadastrado com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar tipo de pessoa.', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post("/associar-tipo-pessoa", async (req, res) => {
    try {
        const dados = req.body;
        const result = await associarTpPe(dados, supabase);

        if (result.success) {
            return res.status(201).json({ message: 'Tipo de pessoa cadastrado com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar tipo de pessoa.', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

//

app.post('/associar-papel-empresa', async (req, res) => {
    try {
        const { usr_id, pap_id, emp_cnpj } = req.body;
        if (!usr_id || !pap_id || !emp_cnpj) {
            return res.status(400).json({ message: 'Usuário, papel e empresa são obrigatórios.' });
        }
        const { error } = await supabase
            .from('pap_usr_emp')
            .insert([{ usr_id, pap_id, emp_cnpj }]);
        if (error) throw error;
        res.status(201).json({ message: 'Papel e empresa associados com sucesso!' });

    } catch (error) {
        console.error('Erro ao associar papel e empresa:', error.message);
        res.status(500).json({ message: 'Erro ao associar papel e empresa.' });
    }
});

app.post('/associar-endereco', async (req, res) => {
    try {
        const { schema, pes_id, epe_numero, epe_complemento, epe_tipo, end_cep, epe_latitude, epe_longitude } = req.body;

        if (!schema) {
            return res.status(400).json({ message: 'O campo schema é obrigatório.' });
        }

        if (!pes_id || !epe_tipo || !end_cep) {
            return res.status(400).json({ message: 'Os campos pes_id, epe_tipo e end_cep são obrigatórios.' });
        }

        const { error } = await supabase
            .schema(schema)
            .from('endereco_pessoa')
            .insert([{
                pes_id,
                epe_numero,
                epe_complemento,
                epe_tipo,
                end_cep,
                epe_latitude,
                epe_longitude,
            }]);

        if (error) throw error;

        res.status(201).json({ message: 'Endereço associado com sucesso!' });
    } catch (error) {
        console.error('Erro ao associar endereço à pessoa:', error.message);
        res.status(500).json({ message: 'Erro ao associar endereço à pessoa.' });
    }
});



app.post('/associar-contato-pessoa', async (req, res) => {
    try {
        const { schema, ctt_contato, ctt_tipo, pes_id, ctt_numero_email } = req.body;

        // Logando os dados recebidos no request
        console.log('Dados recebidos:', {
            schema,
            ctt_contato,
            ctt_tipo,
            pes_id,
            ctt_numero_email,
        });

        if (!schema) {
            console.warn('Schema não fornecido.');
            return res.status(400).json({ message: 'O campo schema é obrigatório.' });
        }

        if (!pes_id || !ctt_contato || !ctt_tipo) {
            console.warn('Campos obrigatórios ausentes:', { pes_id, ctt_contato, ctt_tipo });
            return res.status(400).json({ message: 'Os campos pes_id, ctt_contato e ctt_tipo são obrigatórios.' });
        }

        const { error } = await supabase
            .schema(schema)
            .from('contatos')
            .insert([{
                ctt_contato,
                ctt_tipo,
                pes_id,
                ctt_numero_email,
            }]);

        if (error) {
            console.error('Erro ao inserir contato no banco de dados:', error.message);
            throw error;
        }

        console.log('Contato associado com sucesso no schema:', schema);
        res.status(201).json({ message: 'Contato associado com sucesso!' });
    } catch (error) {
        console.error('Erro ao associar contato à pessoa:', error.message);
        res.status(500).json({ message: 'Erro ao associar contato à pessoa.' });
    }
});


app.get('/listar-contatos-pessoa', async (req, res) => {
    try {
        const { pes_id } = req.query
        if (!pes_id) {
            return res.status(400).json({ message: 'O campo pes_id e obrigatorio' })
        }

        const { data, error } = await supabase
            .schema('belaarte')
            .from('contatos')
            .select('*')
            .eq('pes_id', pes_id)

        if (error) throw error

        res.status(200).json({ data })
    } catch (error) {
        console.log('Erro ao listar contatos', error.message)
        res.status(500).json({ message: 'erro ao listar Contatos' })
    }
})

app.get('/listar-tipos-pessoa', async (req, res) => {
    try {
        const { data, error } = await supabase
            .schema('belaarte')
            .from('tipo_pessoa')
            .select('*');

        if (error) throw error;
        res.status(200).json({ data })
    } catch (error) {
        console.log('Erro ao listar Tipos', error.message)
        res.status(500).json({ message: 'Erro ao listar Tipos' })
    }
})



app.post('/atualizar-associacoes', async (req, res) => {
    const { usr_id, papeis, empresas } = req.body;
    try {
        const { error: deleteError } = await supabase
            .from('pap_usr_emp')
            .delete()
            .eq('usr_id', usr_id);

        if (deleteError) throw deleteError;

        const newAssociations = [];
        for (let pap_id of papeis) {
            for (let emp_cnpj of empresas) {
                const { data: existingAssociations, error: selectError } = await supabase
                    .from('pap_usr_emp')
                    .select('usr_id')
                    .eq('usr_id', usr_id)
                    .eq('pap_id', pap_id)
                    .eq('emp_cnpj', emp_cnpj);

                if (selectError) throw selectError;
                if (existingAssociations.length === 0) {
                    newAssociations.push({ usr_id, pap_id, emp_cnpj });
                }
            }
        }

        if (newAssociations.length > 0) {
            const { error: insertError } = await supabase
                .from('pap_usr_emp')
                .upsert(newAssociations, { onConflict: ['usr_id', 'pap_id', 'emp_cnpj'] });

            if (insertError) throw insertError;
        }
        res.status(200).json({ message: 'Associações atualizadas com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar associações', error: error.message });
    }
});



app.post('/associar-permissao', async (req, res) => {
    try {
        const { papel_id, permissao_id } = req.body;

        if (!papel_id || !permissao_id) {
            return res.status(400).json({ message: 'Papel e permissão são obrigatórios.' });
        }
        const { error } = await supabase
            .from('papel_permissao')
            .insert({ papel_id, permissao_id });
        if (error) throw error;

        res.status(201).json({ message: 'Permissão associada com sucesso!' });
    } catch (error) {
        console.error('Erro ao associar permissão:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// GET
app.get('/lista-empresas', async (req, res) => {
    try {
        const { data, error } = await supabase.from('empresas').select('emp_nome, emp_cnpj')
        if (error) {
            throw error
        }
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar emrpesas', error.message)
        res.status(500).json({ message: 'Error ao listar empresas' })
    }
})

app.get('/listar-endereco-pessoa', async (req, res) => {
    try {
        const { schema } = req.query;
        if (!schema) {
            return res.status(400).json({ message: 'Schema não fornecido.' });
        }

        const { data, error } = await supabase
            .schema(schema)
            .from('endereco_pessoa')
            .select('*');

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao listar endereço pessoa:', error.message);
        res.status(500).json({ message: 'Erro ao listar endereço pessoa.' });
    }
});


app.get('/buscar-schema', async (req, res) => {
    const { cnpj } = req.query;

    try {
        // Busca o schema associado ao CNPJ
        const { data, error } = await supabase
            .from('empresas')
            .select('emp_bdschema')
            .eq('emp_cnpj', cnpj)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        // Retorna o schema encontrado
        res.json({ schema: data.emp_bdschema });
    } catch (error) {
        console.error('Erro ao buscar schema:', error.message);
        res.status(500).json({ error: 'Erro interno ao buscar schema' });
    }
});

app.get('/dados-empresa', async (req, res) => {
    const { cnpj } = req.query;  // Pegando o CNPJ da query string

    try {
        // Busca o schema associado ao CNPJ
        const { data, error } = await supabase
            .from('empresas')
            .select('*')  // Seleciona todos os dados da empresa
            .eq('emp_cnpj', cnpj)
            .single();  // Retorna um único resultado

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        // Retorna os dados encontrados
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error.message);
        res.status(500).json({ error: 'Erro interno ao buscar dados da empresa' });
    }
});



app.get('/pessoas', async (req, res) => {
    try {
        const { schema } = req.query;

        if (!schema) {
            return res.status(400).json({ message: 'O campo schema é obrigatório.' });
        }

        const { data, error } = await supabase
            .schema(schema)
            .from('pessoas')
            .select('*');
        if (error) throw error;

        res.status(200).json({ data });

    } catch (error) {
        console.error('Erro ao listar pessoas:', error.message);
        res.status(500).json({ message: 'Erro ao listar pessoas.' });
    }
});

app.get('/listar-endereco', async (req, res) => {
    try {
        const { pes_id, schema } = req.query;

        if (!pes_id || !schema) {
            return res.status(400).json({ message: 'Os campos pes_id e schema são obrigatórios.' });
        }

        const { data, error } = await supabase
            .schema(schema)
            .from('endereco_pessoa')
            .select('*')
            .eq('pes_id', pes_id);
        console.log('Schema:', schema); // Adicionar log


        if (error) throw error;

        res.status(200).json({ data });

    } catch (error) {
        console.error('Erro ao listar endereços:', error.message);
        res.status(500).json({ message: 'Erro ao listar endereços.' });
    }
});


app.get('/listar-papeis', async (req, res) => {
    try {
        const { data, error } = await supabase.from('papeis').select('pap_papel, pap_id');
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao listar papéis:', error.message);
        res.status(500).json({ message: 'Erro ao listar papéis.' });
    }
});



app.get('/listar-permissoes', async (req, res) => {
    try {
        const { data, error } = await supabase.from('permissoes').select('per_id, per_descricao')
        if (error) throw error
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar permissoes', error.message)
        res.status(500).json({ message: 'Erro ao listar permissões' })
    }
})



app.get('/listar-usuarios', async (req, res) => {
    try {
        const { data, error } = await supabase.from('usuarios').select('*')
        if (error) throw error
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar usuarios', error.message)
        res.status(500).json({ message: 'Erro ao listar usuarios' })
    }
})

app.get('/permissoes-por-papel/:papelId', async (req, res) => {
    const { papelId } = req.params;

    try {
        const { data: papelPermissoes, error: papelError } = await supabase
            .from('papel_permissao')
            .select('permissao_id')
            .eq('papel_id', papelId);

        if (papelError) {
            console.error("Erro ao buscar permissões do papel:", papelError);
            return res.status(500).json({ message: "Erro ao buscar permissões do papel." });
        }

        if (!papelPermissoes || papelPermissoes.length === 0) {
            return res.status(200).json([]);
        }

        const permissaoIds = papelPermissoes.map((item) => item.permissao_id);


        const { data: permissoes, error: permError } = await supabase
            .from('permissoes')
            .select('per_permissao, per_id')
            .in('per_id', permissaoIds);

        if (permError) {
            console.error("Erro ao buscar permissões detalhadas:", permError);
            return res.status(500).json({ message: "Erro ao buscar permissões detalhadas." });
        }

        res.status(200).json(permissoes);
    } catch (error) {
        console.error("Erro ao buscar permissões do papel:", error.message);
        res.status(500).json({ message: "Erro interno ao buscar permissões.", details: error.message });
    }
});



app.get('/listar-associacoes/:usr_id', async (req, res) => {
    const { usr_id } = req.params;
    try {
        const { data, error } = await supabase
            .from('pap_usr_emp')
            .select('pap_id, emp_cnpj, empresas(emp_nome), papeis(pap_papel)')
            .eq('usr_id', usr_id);
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao listar associações:', error.message);
        res.status(500).json({ message: 'Erro ao listar associações.' });
    }
});



app.delete('/remover-permissao', async (req, res) => {
    try {
        const { papel_id, permissao_id } = req.body;

        if (!papel_id || !permissao_id) {
            return res.status(400).json({ message: 'Papel e permissão são obrigatórios.' });
        }

        const { error } = await supabase
            .from('papel_permissao')
            .delete()
            .eq('papel_id', papel_id)
            .eq('permissao_id', permissao_id);

        if (error) throw error;

        res.status(200).json({ message: 'Permissão removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover permissão:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});



app.post('/login-master', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('usr_id, usr_email, usr_senha, usr_perfil, usr_grupo')
            .eq('usr_email', email)
            .eq('usr_senha', senha);
        if (error) {
            throw error;
        }

        if (usuarios.length === 0) {
            return res.status(403).json({ message: 'Credenciais incorretas.' });
        }

        const usuario = usuarios[0];

        if (usuario.usr_perfil === 'Master' || usuario.usr_perfil === 'Administrador' || usuario.usr_perfil === 'Operador') {
            return res.status(200).json({
                message: 'Login bem-sucedido!',
                user: {
                    email: usuario.usr_email,
                    perfil: usuario.usr_perfil,
                    grupo: usuario.usr_grupo,
                    id: usuario.usr_id
                },
            });
        } else {
            return res.status(403).json({ message: 'Acesso negado: perfil não autorizado.' });
        }
    } catch (error) {
        console.error('Erro ao autenticar:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
