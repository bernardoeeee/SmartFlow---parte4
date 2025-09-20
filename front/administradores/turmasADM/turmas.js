function visualizarTurmas(event) {
    event.preventDefault();
    window.location.href = "./visualizarADM/visualizarTurmas.html";
}

async function criarTurma(event) {
    event.preventDefault();

    const nome_turma = document.getElementById("turma").value

    if (nome_turma === "") {
        alert("Por favor, preencha o campo de turma.");
        return;
    }

    const response = await fetch("http://localhost:3000/turmaCriada", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome_turma })
    });
    let results = await response.json();

    if (results.success) {
        alert(results.message);
    } else {
        alert(results.message);
    }

}