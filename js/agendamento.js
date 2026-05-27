const form = document.querySelector(".formulario");

/* LOCAL STORAGE */

let agendamentos = JSON.parse(
    localStorage.getItem("agendamentos")
) || [];

/* AGENDAR */

if(form){

    form.addEventListener("submit", function(event){

        event.preventDefault();

        const dia = document.getElementById("dia").value;

        const horario = document.getElementById(
            "horarioSelecionado"
        ).value;

        const mensagem = document.querySelector(
            'textarea[name="mensagem"]'
        ).value;

        // VALIDAR

        if(dia === ""){

            alert("Escolha um dia!");

            return;
        }

        if(horario === ""){

            alert("Escolha um horário!");

            return;
        }

        /* NOVO AGENDAMENTO */

        const novoAgendamento = {

            dia,
            horario,
            mensagem
        };

        /* SALVAR */

        agendamentos.push(novoAgendamento);

        localStorage.setItem(
            "agendamentos",
            JSON.stringify(agendamentos)
        );

        alert(
            `Agendamento confirmado!
            
Dia: ${dia}
Horário: ${horario}`
        );

        form.reset();

        document.getElementById(
            "horarios"
        ).innerHTML = "";

        document.getElementById(
            "horarioSelecionado"
        ).value = "";
    });
}

/* MOSTRAR HORARIOS */

function mostrarHorarios(){

    const dia = document.getElementById("dia").value;

    const horariosDiv = document.getElementById("horarios");

    horariosDiv.innerHTML = "";

    // DOMINGO

    if(dia === "domingo"){

        horariosDiv.innerHTML = `
            <p class="fechado">
                Domingo: Fechado
            </p>
        `;

        return;
    }

    let inicio = 10;
    let fim = 18;

    // SABADO

    if(dia === "sabado"){

        inicio = 9;
        fim = 18;
    }

    // GERAR HORARIOS

    for(let hora = inicio; hora <= fim; hora++){

        horariosDiv.innerHTML += `

            <button 
                type="button"
                class="horario-btn"
                onclick="selecionarHorario(this, '${hora}:00')"
            >
                ${hora}:00
            </button>

        `;
    }
}

/* SELECIONAR HORARIO */

function selecionarHorario(botao, horario){

    document.querySelectorAll(".horario-btn").forEach(btn => {

        btn.classList.remove("ativo");
    });

    botao.classList.add("ativo");

    document.getElementById(
        "horarioSelecionado"
    ).value = horario;
}