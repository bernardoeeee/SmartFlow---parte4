const express = require('express');
const cors = require('cors');
const connection = require('./db_config.js');
const porta = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));

// LOGIN
app.post('/usuario/login', (req, res) => {
    const { email, senha } = req.body;
    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    connection.query(query, [email, senha], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor.' });
        if (results.length > 0) {
            const user = results[0];
            // aqui você já sabe o domínio do email ou tem um campo 'role' no banco
            let role;
            const domain = user.email.split('@')[1];
            if (domain === 'SFadm.com.br') role = 'admin';
            else if (domain === 'SFprof.com.br') role = 'prof';
            else if (domain === 'SFaluno.com.br') role = 'aluno';

            res.json({ success: true, message: 'Login bem-sucedido!', user, role });
        } else {
            res.json({ success: false, message: 'Usuário ou senha incorretos!' });
        }
    });
});


// TURMAS
app.post('/turmaCriada', (req, res) => {
    const { nome_turma } = req.body;
    const query = 'INSERT INTO turma (nome_turma) VALUES (?)';
    connection.query(query, [nome_turma], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao criar turma.(server)' });
        res.json({ success: true, message: 'Turma criada com sucesso!' });
    });
});

app.get('/turmaCriadaVisualizar', (req, res) => {
    const query = 'SELECT * FROM turma';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao listar turmas.' });
        res.json({ success: true, turmas: results });
    });
});

app.delete('/turmaCriadaExcluir/:nome_turma', (req, res) => {
    const { nome_turma } = req.params;
    const query = 'DELETE FROM turma WHERE nome_turma = ?';
    connection.query(query, [nome_turma], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao remover turma.' });
        res.json({ success: true, message: 'Turma removida com sucesso!' });
    });
});

app.put('/turmaCriadaEditar/:nome_turma', (req, res) => {
    const nomeAntigo = req.params.nome_turma;
    const { nome_turma } = req.body;
    const query = 'UPDATE turma SET nome_turma = ? WHERE nome_turma = ?';
    connection.query(query, [nome_turma, nomeAntigo], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao editar turma.' });
        res.json({ success: true, message: 'Turma editada com sucesso!' });
    });
});


app.get('/professoresPorTurma/:nome_turma', (req, res) => {
    const { nome_turma } = req.params;
    const query = `
        SELECT p.email_prof, u.nome, p.materia
        FROM professores p
        JOIN usuarios u ON p.email_prof = u.email
        WHERE p.nome_turma = ?
    `;
    connection.query(query, [nome_turma], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar professores.' });
        res.json({ success: true, professores: results });
    });
});
app.get('/alunosPorTurma/:nome_turma', (req, res) => {
    const { nome_turma } = req.params;
    const query = `
        SELECT a.email_aluno, u.nome, u.nasc
        FROM alunos a
        JOIN usuarios u ON a.email_aluno = u.email
        WHERE a.nome_turma = ?
    `;
    connection.query(query, [nome_turma], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar alunos.' });
        res.json({ success: true, alunos: results });
    });
});

// PROFESSORES
app.post('/professorCriado', (req, res) => {
    const { emailProfessor, nomeProfessor, nascProfessor, senhaProfessor, materiaProfessor, turmasProfessor } = req.body;

    // Primeiro, tenta inserir na tabela usuarios
    const queryUsuario = 'INSERT INTO usuarios (email, nome, nasc, senha) VALUES (?, ?, ?, ?)';
    connection.query(queryUsuario, [emailProfessor, nomeProfessor, nascProfessor, senhaProfessor], (err) => {
        if (err && err.code !== 'ER_DUP_ENTRY') {
            // Se for outro erro que não duplicidade, retorna erro
            return res.status(500).json({ success: false, message: 'Erro ao criar usuário professor.(server)' });
        }

        // Agora, insere na tabela professores para cada turma
        if (!Array.isArray(turmasProfessor) || turmasProfessor.length === 0) {
            return res.status(400).json({ success: false, message: 'Selecione ao menos uma turma.(server)' });
        }

        const queryProfessor = 'INSERT INTO professores (email_prof, materia, nome_turma) VALUES ?';
        const values = turmasProfessor.map(turma => [emailProfessor, materiaProfessor, turma]);

        connection.query(queryProfessor, [values], (err2) => {
            if (err2) {
                // Se já existe o vínculo professor/turma, pode ser erro de duplicidade
                if (err2.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, message: 'Professor já cadastrado em uma das turmas selecionadas.' });
                }
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar professor nas turmas.(server)' });
            }
            res.json({ success: true, message: 'Professor cadastrado com sucesso!(server)' });
        });
    });
});

app.get('/professorCriadoVisualizar', (req, res) => {
    const query = `
        SELECT p.email_prof, u.nome, u.nasc, p.materia, p.nome_turma
        FROM professores p
        JOIN usuarios u ON p.email_prof = u.email
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao listar professores.' });
        res.json({ success: true, professores: results });
    });
});

app.delete('/professorCriadoExcluir/:email_prof/:nome_turma', (req, res) => {
    const { email_prof, nome_turma } = req.params;
    const query = 'DELETE FROM professores WHERE email_prof = ? AND nome_turma = ?';
    connection.query(query, [email_prof, nome_turma], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao remover professor.' });
        res.json({ success: true, message: 'Professor removido com sucesso!' });
    });
});

app.put('/professorCriadoEditar/:email_prof/:nome_turma', (req, res) => {
    const { email_prof, nome_turma } = req.params;
    const { materia } = req.body;
    const query = 'UPDATE professores SET materia = ? WHERE email_prof = ? AND nome_turma = ?';
    connection.query(query, [materia, email_prof, nome_turma], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao editar professor.' });
        res.json({ success: true, message: 'Professor editado com sucesso!' });
    });
});

// ALUNOS


app.post('/alunoCriado', (req, res) => {
    const { emailAluno, nomeAluno, nascAluno, senhaAluno, turmasAluno } = req.body;

    // Primeiro, tenta inserir na tabela usuarios
    const queryUsuario = 'INSERT INTO usuarios (email, nome, nasc, senha) VALUES (?, ?, ?, ?)';
    connection.query(queryUsuario, [emailAluno, nomeAluno, nascAluno, senhaAluno], (err) => {
        if (err && err.code !== 'ER_DUP_ENTRY') {
            // Se for outro erro que não duplicidade, retorna erro
            return res.status(500).json({ success: false, message: 'Erro ao criar usuário aluno.' });
        }

        // Agora, insere na tabela alunos para cada turma
        if (!Array.isArray(turmasAluno) || turmasAluno.length === 0) {
            return res.status(400).json({ success: false, message: 'Selecione ao menos uma turma.' });
        }

        const queryAluno = 'INSERT INTO alunos (email_aluno, nome_turma) VALUES ?';
        const values = turmasAluno.map(turma => [emailAluno, turma]);

        connection.query(queryAluno, [values], (err2) => {
            if (err2) {
                if (err2.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, message: 'Aluno já cadastrado em uma das turmas selecionadas.' });
                }
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno nas turmas.' });
            }
            res.json({ success: true, message: 'Aluno cadastrado com sucesso!' });
        });
    });
});



app.get('/alunoCriadoVisualizar', (req, res) => {
    const query = `
        SELECT a.email_aluno, u.nome, u.nasc, a.nome_turma
        FROM alunos a
        JOIN usuarios u ON a.email_aluno = u.email
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao listar alunos.' });
        res.json({ success: true, alunos: results });
    });
});

app.delete('/alunoCriadoExcluir/:email_aluno/:nome_turma', (req, res) => {
    const { email_aluno, nome_turma } = req.params;
    const query = 'DELETE FROM alunos WHERE email_aluno = ? AND nome_turma = ?';
    connection.query(query, [email_aluno, nome_turma], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao remover aluno.' });
        res.json({ success: true, message: 'Aluno removido com sucesso!' });
    });
});

app.put('/alunoCriadoEditar/:email_aluno/:nome_turma', (req, res) => {
    const { email_aluno, nome_turma } = req.params;
    const { novo_nome_turma } = req.body;
    const query = 'UPDATE alunos SET nome_turma = ? WHERE email_aluno = ? AND nome_turma = ?';
    connection.query(query, [novo_nome_turma, email_aluno, nome_turma], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao editar aluno.' });
        res.json({ success: true, message: 'Aluno editado com sucesso!' });
    });
});

// PRESENÇAS
app.post('/chamadaAlunos', (req, res) => {
    const { email_aluno, presente } = req.body;
    const query = 'INSERT INTO presencas (email_aluno, presente) VALUES (?, ?)';
    connection.query(query, [email_aluno, presente], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao registrar presença.' });
        res.json({ success: true, message: 'Presença registrada com sucesso!' });
    });
});

app.get('/presencas/:email_aluno', (req, res) => {
    const { email_aluno } = req.params;
    const query = 'SELECT * FROM presencas WHERE email_aluno = ?';
    connection.query(query, [email_aluno], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar presenças.' });
        res.json({ success: true, presencas: results });
    });
});

// AVALIAÇÕES
app.post('/lancarNota', (req, res) => {
    const { email_aluno, trimestre, nota1, nota2, media } = req.body;
    const query = 'INSERT INTO avaliacoes (email_aluno, trimestre, nota1, nota2, media) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [email_aluno, trimestre, nota1, nota2, media], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao lançar nota.' });
        res.json({ success: true, message: 'Nota lançada com sucesso!' });
    });
});

app.get('/avaliacoes/:email_aluno', (req, res) => {
    const { email_aluno } = req.params;
    const query = 'SELECT * FROM avaliacoes WHERE email_aluno = ?';
    connection.query(query, [email_aluno], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar avaliações.' });
        res.json({ success: true, avaliacoes: results });
    });
});

// ALUNOS PODEM FAZER
