// BOTÃO LOGIN
async function cadastrarProfessor(event) {
    event.preventDefault();

    const emailProfessor = document.getElementById('email').value;
    const nomeProfessor = document.getElementById('nome').value;
    const nascProfessor = document.getElementById('nasc').value;
    const senhaProfessor = document.getElementById('senha').value;
    const materiaProfessor = document.getElementById('materia').value;

    // Coletar todas as turmas marcadas
    const turmasProfessor = Array.from(document.querySelectorAll('input[name="turmas"]:checked')).map(cb => cb.value);

    const data = { emailProfessor, nomeProfessor, nascProfessor, senhaProfessor, materiaProfessor, turmasProfessor };

    const response = await fetch("http://localhost:3000/professorCriado", {
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
    listarProfessores();
    // listarTurmas();
});

async function listarProfessores() {
    const response = await fetch("http://localhost:3000/professorCriadoVisualizar");
    const results = await response.json();
    const container = document.getElementById('professoresCadastrados');
    container.innerHTML = '';
    if (results.success) {
        results.professores.forEach(prof => {
            const infoHTML = document.createElement('div');
            infoHTML.classList.add('professor');
            infoHTML.innerHTML = `
                <div class="professor">
                <p><strong>Nome:</strong> ${prof.nome}</p>
                <p><strong>Email:</strong> ${prof.email_prof}</p>
                <p><strong>Matéria:</strong> ${prof.materia}</p>
                <p><strong>Turma:</strong> ${prof.nome_turma}</p>
                </div>
                
            `;
            // const botoesHTML = document.createElement('div');
            // botoesHTML.classList.add('botoes');
            // botoesHTML.innerHTML = `
            // <div class="botoes">
            //     <button onclick="removerConta('${prof.s}')">
            //         <i class="fa-solid fa-trash fa-2xl" style="color: #ff0000;"></i>
            //     </button>
            //     <button onclick="editarConta('${prof.s}')">
            //         <i class="fa-solid fa-user-pen fa-2xl" style="color: #4CAF50;"></i>
            //     </button>
            // </div>
            // `;
            container.appendChild(infoHTML);
            // container.appendChild(botoesHTML);
        }
        );
    } else {
        container.innerHTML = '<p>Erro ao carregar professores.</p>';
    }
}


// async function listarTurmas() {
//     const response = await fetch("http://localhost:3000/turmaCriadaVisualizar");
//     const results = await response.json();
//     const container = document.getElementById('checkboxTurmas');
//     container.innerHTML = '';
//     if (results.success) {
//         results.turmas.forEach(turma => {
//             const div = document.createElement('div');
//             div.classList.add('checkbox-item');
//             div.innerHTML = `
//                 <input type="checkbox" id="turma_${turma.nome_turma}" name="turmas" value="${turma.nome_turma}">
//                 <label for="turma_${turma.nome_turma}">${turma.nome_turma}</label>
//             `;
//             container.appendChild(div);
//         });
//     } else {
//         container.innerHTML = '<p>Erro ao carregar turmas.</p>';
//     }
// }