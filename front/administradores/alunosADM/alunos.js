async function cadastrarAluno(event) {
    event.preventDefault();

    const emailAluno = document.getElementById('email').value;
    const nomeAluno = document.getElementById('nome').value;
    const nascAluno = document.getElementById('nasc').value;
    const senhaAluno = document.getElementById('senha').value;


    // Coletar todas as turmas marcadas
    const turmasAluno = Array.from(document.querySelectorAll('input[name="turmas"]:checked')).map(cb => cb.value);

    const data = { emailAluno, nomeAluno, nascAluno, senhaAluno, turmasAluno };

    const response = await fetch("http://localhost:3000/alunoCriado", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let results = await response.json();

    if (results.success) {
        alert(results.message);
    } else {
        alert(results.message);
    }
}


addEventListener('DOMContentLoaded', () => {
    ListarAlunos();
    // listarTurmas();
});

async function ListarAlunos() {
    const response = await fetch("http://localhost:3000/alunoCriadoVisualizar");
    const results = await response.json();
    const container = document.getElementById('alunosCadastrados');
    container.innerHTML = '';
    if (results.success) {
        results.alunos.forEach(aluno => {
            const div = document.createElement('div');
            div.classList.add('aluno');
            div.innerHTML = `
                <div class="aluno">
                <p><strong>Nome:</strong> ${aluno.nome}</p>
                <p><strong>Email:</strong> ${aluno.email_aluno}</p>
                <p><strong>Turma:</strong> ${aluno.nome_turma}</p>
                </div>
                
            `;
            container.appendChild(div);
        }
        );
    } else {
        container.innerHTML = '<p>Erro ao carregar alunos.</p>';
    }
}