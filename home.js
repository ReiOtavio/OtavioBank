/* Verifica se o usuário está logado */
const loggedUser = localStorage.getItem("loggedUser");

if (!loggedUser) {
  window.location.href = "login.html";
} else {
  const user = JSON.parse(loggedUser);
  document.getElementById("user-name").textContent = `Olá, ${user.username}!`;

  /* Pega o saldo e histórico do usuário */
  const saldo = user.saldo || 0;
  const historico = user.historico || [];

  document.getElementById("saldo").textContent = `R$ ${saldo.toFixed(2)}`;
  atualizarHistorico(historico);
}

/* Função para atualizar a lista de histórico */
function atualizarHistorico(historico) {
  const lista = document.getElementById("historico-lista");
  lista.innerHTML = "";

  if (historico.length === 0) {
    lista.innerHTML = "<li>Nenhuma transação encontrada.</li>";
    return;
  }

  historico.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.tipo}: R$ ${item.valor.toFixed(2)} (${item.data})`;
    lista.appendChild(li);
  });
}

/* Função para atualizar saldo e salvar no localStorage */
function atualizarUsuario(novoSaldo, tipo, valor) {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const data = new Date().toLocaleString("pt-BR");
  const novaTransacao = { tipo, valor, data };

  user.saldo = novoSaldo;
  user.historico = user.historico || [];
  user.historico.unshift(novaTransacao);

  /* Atualiza no array de usuários */
  const index = users.findIndex(u => u.username === user.username);
  if (index !== -1) users[index] = user;

  localStorage.setItem("loggedUser", JSON.stringify(user));
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("saldo").textContent = `R$ ${novoSaldo.toFixed(2)}`;
  atualizarHistorico(user.historico);
}

/* Modal Handling */
const modal = document.getElementById("modal");
const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalFields = document.getElementById("modal-fields");
const modalForm = document.getElementById("modal-form");
const modalError = document.getElementById("modal-error");
const modalClose = document.getElementById("modal-close");

function openModal(action) {
  modal.style.display = "block";
  modalOverlay.style.display = "block";
  modalError.style.display = "none";
  modalFields.innerHTML = "";
  modalForm.dataset.action = action;

  switch (action) {
    case "pix":
      modalTitle.textContent = "Fazer PIX";
      modalFields.innerHTML = `
        <input type="text" id="pix-recipient" placeholder="Nome ou chave PIX" required>
        <input type="number" id="pix-amount" placeholder="Valor (R$)" step="0.01" min="0.01" required>
      `;
      break;
    case "depositar":
      modalTitle.textContent = "Depositar";
      modalFields.innerHTML = `
        <input type="number" id="deposit-amount" placeholder="Valor (R$)" step="0.01" min="0.01" required>
      `;
      break;
    case "sacar":
      modalTitle.textContent = "Sacar";
      modalFields.innerHTML = `
        <input type="number" id="withdraw-amount" placeholder="Valor (R$)" step="0.01" min="0.01" required>
      `;
      break;
    case "emprestimo":
      modalTitle.textContent = "Fazer Empréstimo";
      modalFields.innerHTML = `
        <input type="number" id="loan-amount" placeholder="Valor (R$)" step="0.01" min="0.01" required>
        <select id="loan-terms" required>
          <option value="" disabled selected>Selecione o prazo</option>
          <option value="6">6 meses</option>
          <option value="12">12 meses</option>
          <option value="24">24 meses</option>
        </select>
      `;
      break;
  }
}

function closeModal() {
  modal.style.display = "none";
  modalOverlay.style.display = "none";
  modalForm.reset();
  modalError.style.display = "none";
}

/* Event Listeners for Buttons */
document.getElementById("btnPix").addEventListener("click", () => openModal("pix"));
document.getElementById("btnDepositar").addEventListener("click", () => openModal("depositar"));
document.getElementById("btnSacar").addEventListener("click", () => openModal("sacar"));
document.getElementById("btnEmprestimo").addEventListener("click", () => openModal("emprestimo"));

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const action = modalForm.dataset.action;
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  modalError.style.display = "none";

  switch (action) {
    case "pix":
      const recipient = document.getElementById("pix-recipient").value;
      const pixAmount = parseFloat(document.getElementById("pix-amount").value);
      if (!recipient || isNaN(pixAmount) || pixAmount <= 0) {
        modalError.textContent = "Dados inválidos!";
        modalError.style.display = "block";
        return;
      }
      if (pixAmount > user.saldo) {
        modalError.textContent = "Saldo insuficiente!";
        modalError.style.display = "block";
        return;
      }
      atualizarUsuario(user.saldo - pixAmount, `PIX enviado para ${recipient}`, pixAmount);
      closeModal();
      break;
    case "depositar":
      const depositAmount = parseFloat(document.getElementById("deposit-amount").value);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        modalError.textContent = "Valor inválido!";
        modalError.style.display = "block";
        return;
      }
      atualizarUsuario(user.saldo + depositAmount, "Depósito", depositAmount);
      closeModal();
      break;
    case "sacar":
      const withdrawAmount = parseFloat(document.getElementById("withdraw-amount").value);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        modalError.textContent = "Valor inválido!";
        modalError.style.display = "block";
        return;
      }
      if (withdrawAmount > user.saldo) {
        modalError.textContent = "Saldo insuficiente!";
        modalError.style.display = "block";
        return;
      }
      atualizarUsuario(user.saldo - withdrawAmount, "Saque", withdrawAmount);
      closeModal();
      break;
    case "emprestimo":
      const loanAmount = parseFloat(document.getElementById("loan-amount").value);
      const loanTerms = document.getElementById("loan-terms").value;
      if (isNaN(loanAmount) || loanAmount <= 0 || !loanTerms) {
        modalError.textContent = "Dados inválidos!";
        modalError.style.display = "block";
        return;
      }
      atualizarUsuario(user.saldo + loanAmount, `Empréstimo (${loanTerms} meses)`, loanAmount);
      closeModal();
      break;
  }
});

/* Logout Button */
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
});