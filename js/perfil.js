// perfil.js — PERFIL DO USUÁRIO + FIDELIDADE

// ============================================
// VERIFICA LOGIN
// ============================================
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
  alert("⚠️ Faça login para acessar seu perfil!");
  window.location.href = "../cadastro/cadastro.html";
}

// ============================================
// CARREGAR DADOS DO PERFIL
// ============================================
function carregarPerfil() {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const cliente = clientes.find(c => c.id === usuarioLogado.id) || usuarioLogado;

  // Avatar
  const inicial = cliente.nome.charAt(0).toUpperCase();
  document.getElementById("avatarInicial").textContent = inicial;

  // Nome e email
  document.getElementById("nomePerfil").textContent = cliente.nome;
  document.getElementById("emailPerfil").textContent = cliente.email;

  // Preencher formulário
  document.getElementById("editNome").value = cliente.nome;
  document.getElementById("editEmail").value = cliente.email;
  document.getElementById("editTelefone").value = cliente.telefone || "";

  // Fidelidade
  carregarFidelidade(cliente);
  carregarHistorico();
}

// ============================================
// SISTEMA DE FIDELIDADE
// ============================================
function carregarFidelidade(cliente) {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const clienteEmail = cliente.email;

  // Conta cortes concluídos do usuário
  const cortesConcluidos = agendamentos.filter(
    a => a.clienteEmail === clienteEmail && a.concluido
  ).length;

  const cortesPorCiclo = cortesConcluidos % 5; // 0 a 4
  const cortesParaPremio = 5 - cortesPorCiclo;
  const ciclosCompletos = Math.floor(cortesConcluidos / 5);

  // Atualiza cards
  document.getElementById("totalCortes").textContent = cortesConcluidos;
  document.getElementById("pontosFidelidade").textContent = cortesConcluidos;
  document.getElementById("cortesParaPremio").textContent = cortesParaPremio === 5 ? "🎉 Grátis!" : cortesParaPremio;

  // Barra de progresso
  const progresso = ((5 - cortesParaPremio) / 5) * 100;
  document.getElementById("progressoPreenchido").style.width = progresso + "%";

  // Selos
  const selosDiv = document.getElementById("selosFidelidade");
  selosDiv.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const selo = document.createElement("span");
    selo.className = `selo ${i <= cortesPorCiclo ? 'selo-preenchido' : 'selo-vazio'}`;
    selo.textContent = i <= cortesPorCiclo ? "⭐" : "○";
    selosDiv.appendChild(selo);
  }

  // Nível de fidelidade
  const nivelEl = document.getElementById("nivelFidelidade");
  if (ciclosCompletos >= 10) {
    nivelEl.textContent = "💎 Cliente Diamante";
    nivelEl.className = "nivel-fidelidade nivel-diamante";
  } else if (ciclosCompletos >= 5) {
    nivelEl.textContent = "🥇 Cliente Ouro";
    nivelEl.className = "nivel-fidelidade nivel-ouro";
  } else if (ciclosCompletos >= 3) {
    nivelEl.textContent = "🥈 Cliente Prata";
    nivelEl.className = "nivel-fidelidade nivel-prata";
  } else if (ciclosCompletos >= 1) {
    nivelEl.textContent = "🥉 Cliente Bronze";
    nivelEl.className = "nivel-fidelidade nivel-bronze";
  } else {
    nivelEl.textContent = "🌟 Cliente Novo";
    nivelEl.className = "nivel-fidelidade nivel-novo";
  }
}

// ============================================
// HISTÓRICO DE AGENDAMENTOS
// ============================================
let filtroHistorico = "todos";

function carregarHistorico() {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const clienteEmail = usuarioLogado.email;

  let meusAgendamentos = agendamentos.filter(a => a.clienteEmail === clienteEmail);

  if (filtroHistorico === "pendente") {
    meusAgendamentos = meusAgendamentos.filter(a => !a.concluido);
  } else if (filtroHistorico === "concluido") {
    meusAgendamentos = meusAgendamentos.filter(a => a.concluido);
  }

  const div = document.getElementById("historicoAgendamentos");

  if (meusAgendamentos.length === 0) {
    div.innerHTML = '<p style="color:#888;">Nenhum agendamento encontrado.</p>';
    return;
  }

  div.innerHTML = meusAgendamentos.map(a => `
    <div class="card-historico ${a.concluido ? 'concluido' : ''}">
      <div class="info">
        <p><strong>📅 ${a.dia}</strong> — 🕐 ${a.horario}</p>
        <p style="color:#888; font-size:0.85rem;">Agendado em: ${a.data}</p>
      </div>
      <span class="status-agendamento ${a.concluido ? 'status-concluido' : 'status-pendente'}">
        ${a.concluido ? '✅ Concluído' : '⏳ Pendente'}
      </span>
    </div>
  `).join("");
}

function filtrarHistorico(filtro) {
  filtroHistorico = filtro;
  document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("ativo"));
  document.querySelector(`.btn-filtro[onclick*="${filtro}"]`)?.classList.add("ativo");
  carregarHistorico();
}

// ============================================
// EDITAR PERFIL
// ============================================
const formEditar = document.getElementById("formEditarPerfil");
const msgPerfil = document.getElementById("msgPerfil");

if (formEditar) {
  formEditar.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("editNome").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    const telefone = document.getElementById("editTelefone").value.trim();
    const senha = document.getElementById("editSenha").value.trim();

    if (nome.length < 3) {
      mostrarMsg(msgPerfil, "⚠️ Nome deve ter pelo menos 3 letras", "msg-erro");
      return;
    }

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const index = clientes.findIndex(c => c.id === usuarioLogado.id);

    if (index !== -1) {
      clientes[index].nome = nome;
      clientes[index].email = email;
      clientes[index].telefone = telefone;
      if (senha) clientes[index].senha = senha;
      localStorage.setItem("clientes", JSON.stringify(clientes));
    }

    // Atualiza sessão
    const atualizado = { ...usuarioLogado, nome, email, telefone };
    if (senha) atualizado.senha = senha;
    localStorage.setItem("usuarioLogado", JSON.stringify(atualizado));

    mostrarMsg(msgPerfil, "✅ Perfil atualizado com sucesso!", "msg-sucesso");
    carregarPerfil();

    setTimeout(() => {
      msgPerfil.className = "msg-feedback";
    }, 3000);
  });
}

// ============================================
// LOGOUT
// ============================================
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "../index.html";
}

// ============================================
// AUXILIAR
// ============================================
function mostrarMsg(el, texto, classe) {
  el.textContent = texto;
  el.className = "msg-feedback " + classe;
}

// ============================================
// INICIAR
// ============================================
carregarPerfil();