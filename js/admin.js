// admin.js — PAINEL ADMINISTRATIVO

// ============================================
// VERIFICA SE É ADMIN
// ============================================
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado || usuarioLogado.tipo !== "admin") {
  alert("Acesso negado! Faça login como administrador.");
  window.location.href = "../cadastro/cadastro.html";
}

// ============================================
// CARREGAR HORÁRIOS SALVOS
// ============================================
const horariosConfig = JSON.parse(localStorage.getItem("horariosConfig")) || {
  inicioSemana: 10,
  fimSemana: 20,
  inicioSabado: 9,
  fimSabado: 18,
};

document.getElementById("inicioSemana").value = horariosConfig.inicioSemana;
document.getElementById("fimSemana").value = horariosConfig.fimSemana;
document.getElementById("inicioSabado").value = horariosConfig.inicioSabado;
document.getElementById("fimSabado").value = horariosConfig.fimSabado;

// ============================================
// SALVAR HORÁRIOS
// ============================================
function salvarHorarios() {
  const config = {
    inicioSemana: parseInt(document.getElementById("inicioSemana").value),
    fimSemana: parseInt(document.getElementById("fimSemana").value),
    inicioSabado: parseInt(document.getElementById("inicioSabado").value),
    fimSabado: parseInt(document.getElementById("fimSabado").value),
  };

  localStorage.setItem("horariosConfig", JSON.stringify(config));

  const msg = document.getElementById("msgHorarios");
  msg.textContent = "✅ Horários salvos com sucesso!";
  msg.className = "msg-feedback msg-sucesso";

  setTimeout(() => {
    msg.textContent = "";
    msg.className = "msg-feedback";
  }, 3000);
}

// ============================================
// CARREGAR AGENDAMENTOS
// ============================================
let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
let filtroAtual = "todos";

function carregarAgendamentos(filtro = "todos") {
  filtroAtual = filtro;
  const lista = document.getElementById("listaAgendamentos");

  // Atualiza botões de filtro
  document.querySelectorAll(".btn-filtro").forEach(btn => btn.classList.remove("ativo"));
  document.querySelector(`.btn-filtro[onclick*="${filtro}"]`)?.classList.add("ativo");

  let agendamentosFiltrados = agendamentos;

  if (filtro === "pendente") {
    agendamentosFiltrados = agendamentos.filter(a => !a.concluido);
  } else if (filtro === "concluido") {
    agendamentosFiltrados = agendamentos.filter(a => a.concluido);
  }

  if (agendamentosFiltrados.length === 0) {
    lista.innerHTML = '<p style="color:#888;">Nenhum agendamento encontrado.</p>';
    return;
  }

  lista.innerHTML = agendamentosFiltrados.map((a, index) => {
    const indexReal = agendamentos.indexOf(a);
    return `
      <div class="card-agendamento ${a.concluido ? 'concluido' : ''}">
        <div class="info">
          <p><strong>👤 Cliente:</strong> ${a.nome || a.clienteNome || 'Não informado'}</p>
          <p><strong>📅 Dia:</strong> ${a.dia}</p>
          <p><strong>🕐 Horário:</strong> ${a.horario}</p>
          <p><strong>📆 Data agendamento:</strong> ${a.data || 'N/A'}</p>
        </div>
        <div class="acoes">
          ${!a.concluido ? 
            `<button class="btn-concluir" onclick="concluirAgendamento(${indexReal})">✅ Concluir</button>` : 
            ''}
          <button class="btn-excluir" onclick="excluirAgendamento(${indexReal})">🗑️ Excluir</button>
        </div>
      </div>
    `;
  }).join("");
}

// ============================================
// CONCLUIR AGENDAMENTO
// ============================================
function concluirAgendamento(index) {
  if (confirm("Marcar este agendamento como concluído?")) {
    agendamentos[index].concluido = true;
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    carregarAgendamentos(filtroAtual);
  }
}

// ============================================
// EXCLUIR AGENDAMENTO
// ============================================
function excluirAgendamento(index) {
  if (confirm("Tem certeza que deseja excluir este agendamento?")) {
    agendamentos.splice(index, 1);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    carregarAgendamentos(filtroAtual);
  }
}

// ============================================
// FILTRAR
// ============================================
function filtrarAgendamentos(filtro) {
  carregarAgendamentos(filtro);
}

// ============================================
// CARREGAR CLIENTES
// ============================================
function carregarClientes() {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const lista = document.getElementById("listaClientes");

  if (clientes.length === 0) {
    lista.innerHTML = '<p style="color:#888;">Nenhum cliente cadastrado.</p>';
    return;
  }

  lista.innerHTML = clientes.map(c => `
    <div class="card-cliente">
      <div>
        <strong>${c.nome}</strong> — ${c.email}
      </div>
      <span class="tipo ${c.tipo === 'admin' ? 'tipo-admin' : 'tipo-usuario'}">
        ${c.tipo === 'admin' ? '👑 Admin' : '👤 Usuário'}
      </span>
    </div>
  `).join("");
}

// ============================================
// LOGOUT
// ============================================
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "../index.html";
}

// ============================================
// INICIAR
// ============================================
carregarAgendamentos();
carregarClientes();