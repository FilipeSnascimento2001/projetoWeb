const form = document.querySelector(".formulario");

const listaClientes = document.getElementById("listaClientes");

/* LOCAL STORAGE */

let clientes = JSON.parse(
    localStorage.getItem("clientes")
) || [];

/* MOSTRAR CLIENTES */

function mostrarClientes(){

    listaClientes.innerHTML = "";

    clientes.forEach(function(cliente, index){

        listaClientes.innerHTML += `

            <div class="cliente">

                <h3>${cliente.nome}</h3>

                <button onclick="excluirCliente(${index})">
                    Excluir
                </button>

            </div>

        `;
    });
}

/* CADASTRAR */

form.addEventListener("submit", function(event){

    event.preventDefault();

    const nome = document.querySelector(
        'input[name="nome"]'
    ).value;

    const email = document.querySelector(
        'input[name="email"]'
    ).value;

    const telefone = document.querySelector(
        'input[name="telefone"]'
    ).value;

    const mensagem = document.querySelector(
        'textarea[name="mensagem"]'
    ).value;

    /* NOVO CLIENTE */

    const novoCliente = {

        nome,
        email,
        telefone,
        mensagem
    };

    /* ADICIONA NO ARRAY */

    clientes.push(novoCliente);

    /* SALVA TODOS */

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

    /* ALERTA */

    alert("Cliente cadastrado com sucesso!");

    /* MOSTRAR */

    mostrarClientes();

    /* LIMPAR */

    form.reset();
});

/* EXCLUIR */

function excluirCliente(index){

    const confirmar = confirm(
        "Deseja excluir este cliente?"
    );

    if(confirmar){

        clientes.splice(index, 1);

        localStorage.setItem(
            "clientes",
            JSON.stringify(clientes)
        );

        mostrarClientes();
    }
}

/* CARREGAR */

mostrarClientes();