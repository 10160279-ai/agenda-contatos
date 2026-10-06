const API = "http://localhost:3000/contatos";

const lista = document.getElementById("lista");
const form = document.getElementById("form");

async function carregar() {
const params = new URLSearchParams();

const nome = document.getElementById("filtroNome").value;
const cidade = document.getElementById("filtroCidade").value;

if (nome) params.append("nome", nome);
if (cidade) params.append("cidade", cidade);

const resposta = await fetch(`${API}?${params}`);
const contatos = await resposta.json();

lista.innerHTML = "";

if (contatos.length === 0) {
    lista.innerHTML = `
        <tr>
            <td colspan="5">Nenhum contato encontrado.</td>
        </tr>
    `;
    return;
}

contatos.forEach(contato => {
    lista.innerHTML += `
        <tr>
            <td>${contato.nome}</td>
            <td>${contato.telefone}</td>
            <td>${contato.email || "-"}</td>
            <td>${contato.cidade}</td>
            <td>
                <button data-id="${contato.id}" data-acao="editar">
                    Editar
                </button>

                <button data-id="${contato.id}" data-acao="excluir">
                    Excluir
                </button>
            </td>
        </tr>
    `;
});


}

// Buscar
document.getElementById("buscar").onclick = carregar;

// Limpar filtros
document.getElementById("limpar").onclick = () => {
document.getElementById("filtroNome").value = "";
document.getElementById("filtroCidade").value = "";
carregar();
};

// Salvar / editar
form.onsubmit = async (e) => {
e.preventDefault();

const id = document.getElementById("id").value;

const contato = {
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    cidade: document.getElementById("cidade").value
};

if (id) {
    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contato)
    });
} else {
    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contato)
    });
}

limparForm();
carregar();


};

// Botões Editar e Excluir
document.querySelector("table").onclick = async (e) => {
if (e.target.tagName !== "BUTTON") return;

const id = e.target.dataset.id;
const acao = e.target.dataset.acao;

if (acao === "editar") {
    const resposta = await fetch(`${API}/${id}`);
    const contato = await resposta.json();

    document.getElementById("id").value = contato.id;
    document.getElementById("nome").value = contato.nome;
    document.getElementById("telefone").value = contato.telefone;
    document.getElementById("email").value = contato.email || "";
    document.getElementById("cidade").value = contato.cidade;

    document.getElementById("titulo").textContent =
        `Editando: ${contato.nome}`;

    document.getElementById("cancelar").hidden = false;
}

if (acao === "excluir") {
    if (confirm("Deseja excluir este contato?")) {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        carregar();
    }
}


};

// Cancelar edição
document.getElementById("cancelar").onclick = limparForm;

function limparForm() {
form.reset();
document.getElementById("id").value = "";

document.getElementById("titulo").textContent = "Novo contato";

document.getElementById("cancelar").hidden = true;


}

// Carregar ao abrir
carregar();