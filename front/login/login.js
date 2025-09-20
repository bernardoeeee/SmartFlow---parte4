// BOTÃO LOGIN
async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Validate email format
    if (!email || !email.includes('@')) {
        alert('Por favor, insira um email válido.');
        return;
    }



    const data = { email, senha };

    const response = await fetch("http://localhost:3000/usuario/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    let results = await response.json();
    console.log("resultados response", response)
    console.log("resultados results", results)

    if (results.success) {
        localStorage.setItem("Informacoes", JSON.stringify(results.user));
        switch (results.role) {
            case 'admin': window.location.href = '../administradores/adm.html'; break;
            case 'prof': window.location.href = '../professores/prof.html'; break;
            case 'aluno': window.location.href = '../alunos/aluno.html'; break;
        }
    } else {
        alert(results.message);
    }
}

// OLHO
const visualizar = document.getElementById('visualizar')
const input = document.getElementById("senha")
const olho = document.getElementById("olho")

visualizar.addEventListener('click', () => {
    if (input.type === "password") {
        input.type = "text";
        olho.className = 'fa-solid fa-eye fa-1xl'

    } else {
        input.type = "password";
        olho.className = 'fa-solid fa-eye-slash fa-1xl'
    }

})

