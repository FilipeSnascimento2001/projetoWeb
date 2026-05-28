// cadastro.js — CADASTRO, LOGIN E ADMIN

// ============================================
// LOCAL STORAGE
// ============================================
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

// ✅ Admin padrão (criado automaticamente se não existir)
if (!clientes.some(c => c.email === "admin@barbearia.com")) {
  clientes.push({
    id: 0,
    nome: "Administrador",
    email: "admin@barbearia.com",
    senha: "admin123",
    telefone: "",
    tipo: "admin",
    dataCadastro: new Date().toLocaleString("pt-BR")
  });
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// ============================================
// CADASTRO
// ============================================
const formCadastro = document.getElementById("formCadastro");
const msgCadastro = document.getElementById("mensagemCadastro");

if (formCadastro) {
  formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = formCadastro.querySelector('input[name="nome"]').value.trim();
    const email = formCadastro.querySelector('input[name="email"]').value.trim();
    const telefone = formCadastro.querySelector('input[name="telefone"]').value.trim();
    const senha = formCadastro.querySelector('input[name="senha"]').value.trim();

    if (nome.length < 3) {
      mostrarMsg(msgCadastro, "⚠️ Nome deve ter pelo menos 3 letras", "erro");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      mostrarMsg(msgCadastro, "⚠️ Email inválido", "erro");
      return;
    }

    if (senha.length < 4) {
      mostrarMsg(msgCadastro, "⚠️ Senha deve ter pelo menos 4 caracteres", "erro");
      return;
    }

    const emailExiste = clientes.some((c) => c.email === email);
    if (emailExiste) {
      mostrarMsg(msgCadastro, "⚠️ Este email já está cadastrado!", "erro");
      return;
    }

    const novoCliente = {
      id: Date.now(),
      nome,
      email,
      telefone,
      senha,
      tipo: "usuario", // ✅ Todo cadastro novo é usuário
      dataCadastro: new Date().toLocaleString("pt-BR"),
    };

    clientes.push(novoCliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    mostrarMsg(msgCadastro, "✅ Cadastro realizado com sucesso!", "sucesso");
    formCadastro.reset();

    setTimeout(() => {
      msgCadastro.style.display = "none";
    }, 3000);
  });
}

// ============================================
// LOGIN
// ============================================
const formLogin = document.getElementById("formLogin");
const msgLogin = document.getElementById("mensagemLogin");

if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = formLogin.querySelector('input[name="loginEmail"]').value.trim();
    const senha = formLogin.querySelector('input[name="loginSenha"]').value.trim();

    if (!email || !senha) {
      mostrarMsg(msgLogin, "⚠️ Preencha todos os campos!", "erro");
      return;
    }

    const cliente = clientes.find((c) => c.email === email && c.senha === senha);

    if (cliente) {
      localStorage.setItem("usuarioLogado", JSON.stringify(cliente));

      // ✅ REDIRECIONA POR TIPO
      if (cliente.tipo === "admin") {
        mostrarMsg(msgLogin, "✅ Bem-vindo, Administrador!", "sucesso");
        setTimeout(() => {
          window.location.href = "../admin/admin.html";
        }, 1000);
      } else {
        mostrarMsg(msgLogin, `✅ Bem-vindo, ${cliente.nome}!`, "sucesso");
        setTimeout(() => {
          window.location.href = "../agendamento/agendamento.html";
        }, 1000);
      }
    } else {
      mostrarMsg(msgLogin, "❌ Email ou senha incorretos!", "erro");
    }
  });
}

// ============================================
// FUNÇÃO AUXILIAR
// ============================================
function mostrarMsg(elemento, texto, tipo) {
  elemento.innerHTML = texto;
  elemento.className = tipo;
  elemento.style.display = "block";
}