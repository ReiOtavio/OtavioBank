document.getElementById("signupForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorMessage = document.getElementById("error-message");

  let errors = [];

  if (username.length < 4) {
    errors.push("Usuário deve ter pelo menos 4 caracteres.");
  }
  if (password.length < 6) {
    errors.push("Senha deve ter pelo menos 6 caracteres.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos 1 letra maiúscula.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos 1 letra minúscula.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Senha deve conter pelo menos 1 número.");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Senha deve conter pelo menos 1 caractere especial (@, $, !, %, *, ?, &).");
  }
  if (password !== confirmPassword) {
    errors.push("As senhas não coincidem.");
  }

  // 🔹 Nova verificação: usuário já existe
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    errors.push("Usuário já existente. Escolha outro nome.");
  }

  if (errors.length > 0) {
    errorMessage.style.color = "red";
    errorMessage.innerHTML = errors.join("<br>");
  } else {
    // 🔹 Salvando no "banco local"
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    errorMessage.style.color = "green";
    errorMessage.innerHTML = "Conta criada com sucesso!";
    document.getElementById("signupForm").reset();
  }
});
