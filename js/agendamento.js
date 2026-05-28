// agendamento.js — SÓ USUÁRIO LOGADO PODE AGENDAR

// ============================================
// VERIFICA LOGIN
// ============================================
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

// ✅ Se NÃO estiver logado, redireciona para cadastro/login
if (!usuarioLogado) {
  alert("⚠️ Faça login ou cadastre-se para agendar um horário!");
  window.location.href = "../cadastro/cadastro.html";
}

// ✅ Se for ADMIN, redireciona para o painel
if (usuarioLogado && usuarioLogado.tipo === "admin") {
  window.location.href = "../admin/admin.html";
}

// ============================================
// LOCAL STORAGE
// ============================================
let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

// ============================================
// MOSTRAR NOME DO USUÁRIO (OPCIONAL)
// ============================================
if (usuarioLogado) {
  // Adiciona o nome do usuário no formulário (se existir o elemento)
  const infoUsuario = document.getElementById("infoUsuario");
  if (infoUsuario) {
    infoUsuario.innerHTML = `👤 Logado como: <strong>${usuarioLogado.nome}</strong>`;
  }
}

// ============================================
// FORMULÁRIO
// ============================================
const form = document.querySelector(".formulario");
const mensagemDiv = document.getElementById("mensagemAgendamento");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Pega os valores
    const diaSelect = document.getElementById("dia");
    const dia = diaSelect.options[diaSelect.selectedIndex].text;
    const diaValor = diaSelect.value;
    const horario = document.getElementById("horarioSelecionado").value;

    // Limpa mensagens anteriores
    mensagemDiv.style.display = "none";
    mensagemDiv.className = "";

    // ✅ VALIDAÇÃO
    if (diaValor === "") {
      mostrarMensagem("⚠️ Escolha um dia!", "erro");
      return;
    }

    if (horario === "") {
      mostrarMensagem("⚠️ Escolha um horário!", "erro");
      return;
    }

    // ✅ VERIFICA SE O HORÁRIO JÁ ESTÁ OCUPADO
    const horarioOcupado = agendamentos.some(
      (a) => a.diaValor === diaValor && a.horario === horario && !a.concluido
    );

    if (horarioOcupado) {
      mostrarMensagem("❌ Este horário já está ocupado! Escolha outro.", "erro");
      return;
    }

    // ✅ NOVO AGENDAMENTO (com dados do usuário logado)
    const novoAgendamento = {
      id: Date.now(),
      clienteNome: usuarioLogado.nome,
      clienteEmail: usuarioLogado.email,
      dia: dia,
      diaValor: diaValor,
      horario: horario,
      data: new Date().toLocaleString("pt-BR"),
      concluido: false,
    };

    // ✅ SALVAR
    agendamentos.push(novoAgendamento);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

    // ✅ FEEDBACK
    mostrarMensagem(
      `✅ Agendamento confirmado!<br>📅 ${dia}<br>🕐 ${horario}`,
      "sucesso"
    );

    // Limpa formulário
    form.reset();
    document.getElementById("horarios").innerHTML =
      '<p style="color:#888;">Selecione um dia para ver os horários</p>';
    document.getElementById("horarioSelecionado").value = "";

    setTimeout(() => {
      mensagemDiv.style.display = "none";
    }, 3000);
  });
}

// ============================================
// MOSTRAR MENSAGEM DE FEEDBACK
// ============================================
function mostrarMensagem(texto, tipo) {
  mensagemDiv.innerHTML = texto;
  mensagemDiv.className = tipo;
  mensagemDiv.style.display = "block";
}

// ============================================
// MOSTRAR HORÁRIOS DISPONÍVEIS
// ============================================
function mostrarHorarios() {
  const dia = document.getElementById("dia").value;
  const horariosDiv = document.getElementById("horarios");

  horariosDiv.innerHTML = "";
  document.getElementById("horarioSelecionado").value = "";

  if (dia === "domingo" || dia === "") {
    horariosDiv.innerHTML = `
      <p style="color:#e74c3c; font-weight:bold; width:100%; text-align:center;">
        🚫 Domingo: Fechado
      </p>
    `;
    return;
  }

  // ✅ USA CONFIGURAÇÕES DO ADMIN
  const config = JSON.parse(localStorage.getItem("horariosConfig")) || {
    inicioSemana: 10,
    fimSemana: 20,
    inicioSabado: 9,
    fimSabado: 18,
  };

  let inicio, fim;

  if (dia === "sabado") {
    inicio = config.inicioSabado;
    fim = config.fimSabado;
  } else {
    inicio = config.inicioSemana;
    fim = config.fimSemana;
  }

  // ✅ GERA BOTÕES DE HORÁRIOS
  for (let hora = inicio; hora <= fim; hora++) {
    const horarioStr = `${hora}:00`;

    // Verifica se já está ocupado (e não concluído)
    const ocupado = agendamentos.some(
      (a) => a.diaValor === dia && a.horario === horarioStr && !a.concluido
    );

    if (!ocupado) {
      horariosDiv.innerHTML += `
        <button 
          type="button"
          class="horario-btn"
          onclick="selecionarHorario(this, '${horarioStr}')"
        >
          ${horarioStr}
        </button>
      `;
    } else {
      horariosDiv.innerHTML += `
        <button 
          type="button"
          class="horario-btn ocupado"
          disabled
        >
          ${horarioStr} 🔒
        </button>
      `;
    }
  }

  if (horariosDiv.innerHTML === "") {
    horariosDiv.innerHTML = `
      <p style="color:#e74c3c; width:100%; text-align:center;">
        😕 Todos horários ocupados neste dia!
      </p>
    `;
  }
}

// ============================================
// SELECIONAR HORÁRIO
// ============================================
function selecionarHorario(botao, horario) {
  document.querySelectorAll(".horario-btn").forEach((btn) => {
    btn.classList.remove("ativo");
  });

  botao.classList.add("ativo");
  document.getElementById("horarioSelecionado").value = horario;
}