const form = document.querySelector(".formulario");

const listaClientes = document.getElementById("listaClientes");

/* LOCAL STORAGE */

let clientes = JSON.parse(
    localStorage.getItem("clientes")
) || [];

/* MOSTRAR CLIENTES */

function mostrarClientes(){

    if(!listaClientes) return;

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

if(form){

    form.addEventListener("submit", function(event){

        event.preventDefault();

        const nome = document.querySelector(
            'input[name="nome"]'
        ).value;

        const email = document.querySelector(
            'input[name="email"]'
        ).value;

        const senha = document.querySelector(
            'input[name="senha"]'
        ).value;

        const novoCliente = {

            nome,
            email,
            senha
        };

        clientes.push(novoCliente);

        localStorage.setItem(
            "clientes",
            JSON.stringify(clientes)
        );

        alert("Cadastro realizado com sucesso!");

        mostrarClientes();

        form.reset();
    });
}

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