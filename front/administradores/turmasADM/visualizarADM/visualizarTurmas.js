async function carregarTurmas() {
    const resp = await fetch('http://localhost:3000/turmaCriadaVisualizar');
    const data = await resp.json();
    const select = document.createElement('select');
    select.id = 'selectTurma';
    select.innerHTML = `
    <option class="selectTurmas" value="">Selecione a turma</option>
    `;
    data.turmas.forEach(turma => {
        select.innerHTML += `<option value="${turma.nome_turma}">${turma.nome_turma}</option>`;
    });
    document.getElementById('formTurma').appendChild(select);

    select.addEventListener('change', () => mostrarDadosTurma(select.value));
}

async function mostrarDadosTurma(nome_turma) {
    if (!nome_turma) return;

    // Buscar alunos
    const alunosResp = await fetch(`http://localhost:3000/alunosPorTurma/${nome_turma}`);
    const alunosData = await alunosResp.json();

    // Buscar professores
    const profResp = await fetch(`http://localhost:3000/professoresPorTurma/${nome_turma}`);
    const profData = await profResp.json();

    // Montar tabela de alunos
    let html = '<h2>Alunos</h2><table><tr><th>Nome</th><th>Email</th><th>Nascimento</th></tr>';
    alunosData.alunos.forEach(aluno => {
        html += `<tr><td>${aluno.nome}</td><td>${aluno.email_aluno}</td><td>${aluno.nasc}</td></tr>`;
    });
    html += '</table>';

    // Montar tabela de professores
    html += '<h2>Professores</h2><table><tr><th>Nome</th><th>Email</th><th>Matéria</th></tr>';
    profData.professores.forEach(prof => {
        html += `<tr><td>${prof.nome}</td><td>${prof.email_prof}</td><td>${prof.materia}</td></tr>`;
    });
    html += '</table>';


    document.getElementById('formTurma').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', carregarTurmas);
