// avaliacoes.js — SISTEMA DE AVALIAÇÕES + ADMIN

// ============================================
// DADOS
// ============================================
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
let notaSelecionada = 0;
let filtroAtual = "todas";

// ============================================
// INICIAR
// ============================================
function iniciar() {
  verificarLogin();
  carregarMedia();
  carregarAvaliacoes();
}

// ============================================
// VERIFICAR LOGIN (para avaliar)
// ============================================
function verificarLogin() {
  const secaoAvaliar = document.getElementById("secaoAvaliar");
  
  if (!usuarioLogado) {
    secaoAvaliar.innerHTML = `
      <div class="sem-login">
        <p>🔐 <a href="../cadastro/cadastro.html">Faça login</a> para deixar sua avaliação!</p>
      </div>
    `;
    return;
  }

  if (usuarioLogado.tipo === "admin") {
    // Admin pode avaliar também
    document.getElementById("formAvaliacao")?.addEventListener("submit", enviarAvaliacao);
  } else {
    document.getElementById("formAvaliacao")?.addEventListener("submit", enviarAvaliacao);
  }
}

// ============================================
// SELECIONAR ESTRELAS
// ============================================
function selecionarEstrela(valor) {
  notaSelecionada = valor;
  document.getElementById("notaAvaliacao").value = valor;

  document.querySelectorAll(".estrela").forEach((estrela, index) => {
    if (index < valor) {
      estrela.textContent = "★";
      estrela.classList.add("ativa");
    } else {
      estrela.textContent = "☆";
      estrela.classList.remove("ativa");
    }
  });
}

// ============================================
// ENVIAR AVALIAÇÃO
// ============================================
function enviarAvaliacao(e) {
  e.preventDefault();

  if (!usuarioLogado) {
    mostrarMsg("msgAvaliacao", "⚠️ Faça login para avaliar!", "msg-erro");
    return;
  }

  const mensagem = document.getElementById("mensagemAvaliacao").value.trim();

  if (notaSelecionada === 0) {
    mostrarMsg("msgAvaliacao", "⚠️ Selecione uma nota!", "msg-erro");
    return;
  }

  if (mensagem.length < 10) {
    mostrarMsg("msgAvaliacao", "⚠️ Mínimo 10 caracteres na mensagem!", "msg-erro");
    return;
  }

  // Verifica se usuário já avaliou
  const jaAvaliou = avaliacoes.some(a => a.email === usuarioLogado.email);
  if (jaAvaliou && usuarioLogado.tipo !== "admin") {
    if (!confirm("Você já avaliou! Deseja substituir sua avaliação?")) {
      return;
    }
    // Remove avaliação antiga
    avaliacoes = avaliacoes.filter(a => a.email !== usuarioLogado.email);
  }

  const novaAvaliacao = {
    id: Date.now(),
    nome: usuarioLogado.nome,
    email: usuarioLogado.email,
    nota: notaSelecionada,
    mensagem: mensagem,
    data: new Date().toLocaleString("pt-BR"),
    tipoUsuario: usuarioLogado.tipo || "usuario"
  };

  avaliacoes.unshift(novaAvaliacao);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));

  mostrarMsg("msgAvaliacao", "✅ Avaliação enviada com sucesso!", "msg-sucesso");

  // Limpar
  document.getElementById("mensagemAvaliacao").value = "";
  notaSelecionada = 0;
  document.getElementById("notaAvaliacao").value = "0";
  document.querySelectorAll(".estrela").forEach(e => {
    e.textContent = "☆";
    e.classList.remove("ativa");
  });

  carregarMedia();
  carregarAvaliacoes();

  setTimeout(() => {
    document.getElementById("msgAvaliacao").className = "msg-feedback";
  }, 3000);
}

// ============================================
// CARREGAR MÉDIA
// ============================================
function carregarMedia() {
  if (avaliacoes.length === 0) {
    document.getElementById("mediaEstrelas").textContent = "☆☆☆☆☆";
    document.getElementById("notaMedia").textContent = "0.0";
    document.getElementById("totalAvaliacoes").textContent = "(0 avaliações)";
    return;
  }

  const soma = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
  const media = (soma / avaliacoes.length).toFixed(1);
  
  const estrelasCheias = Math.round(parseFloat(media));
  const estrelasStr = "★".repeat(estrelasCheias) + "☆".repeat(5 - estrelasCheias);

  document.getElementById("mediaEstrelas").textContent = estrelasStr;
  document.getElementById("notaMedia").textContent = media;
  document.getElementById("totalAvaliacoes").textContent = `(${avaliacoes.length} avaliações)`;
}

// ============================================
// CARREGAR AVALIAÇÕES
// ============================================
function carregarAvaliacoes() {
  const grid = document.getElementById("gridAvaliacoes");

  let avaliacoesFiltradas = [...avaliacoes];

  // Aplicar filtro
  if (filtroAtual === "recentes") {
    avaliacoesFiltradas.sort((a, b) => b.id - a.id);
  } else if (filtroAtual !== "todas") {
    avaliacoesFiltradas = avaliacoesFiltradas.filter(a => a.nota === parseInt(filtroAtual));
  }

  if (avaliacoesFiltradas.length === 0) {
    grid.innerHTML = `
      <p style="color:#888; text-align:center; grid-column: 1/-1;">
        📭 Nenhuma avaliação encontrada.
      </p>
    `;
    return;
  }

  const isAdmin = usuarioLogado && usuarioLogado.tipo === "admin";

  grid.innerHTML = avaliacoesFiltradas.map(a => `
    <div class="card-avaliacao">
      ${isAdmin ? `
        <button class="btn-excluir-avaliacao" onclick="excluirAvaliacao(${a.id})" title="Excluir avaliação">
          🗑️
        </button>
      ` : ''}
      <div class="estrelas-card">${"★".repeat(a.nota)}${"☆".repeat(5 - a.nota)}</div>
      <div class="nome-cliente">
        ${a.nome} 
        ${a.tipoUsuario === 'admin' ? '<span style="font-size:0.7rem;">👑 Admin</span>' : ''}
      </div>
      <p class="mensagem">"${a.mensagem}"</p>
      <p class="data-avaliacao">📆 ${a.data}</p>
    </div>
  `).join("");
}

// ============================================
// FILTRAR
// ============================================
function filtrarAvaliacoes(filtro) {
  filtroAtual = filtro;
  document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("ativo"));
  document.querySelector(`.btn-filtro[onclick*="${filtro}"]`)?.classList.add("ativo");
  carregarAvaliacoes();
}

// ============================================
// EXCLUIR AVALIAÇÃO (ADMIN)
// ============================================
function excluirAvaliacao(id) {
  if (!usuarioLogado || usuarioLogado.tipo !== "admin") {
    alert("⚠️ Apenas o administrador pode excluir avaliações!");
    return;
  }

  if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
    avaliacoes = avaliacoes.filter(a => a.id !== id);
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
    carregarMedia();
    carregarAvaliacoes();
  }
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
function mostrarMsg(id, texto, classe) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = "msg-feedback " + classe;
}

// ============================================
// INICIAR
// ============================================
iniciar();