document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorMessage = document.getElementById("login-error-message");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    errorMessage.style.color = "green";
    errorMessage.innerHTML = "Login realizado com sucesso!";

    // 🔹 Salva o usuário logado
    localStorage.setItem("loggedUser", JSON.stringify(user));

    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
  } else {
    errorMessage.style.color = "red";
    errorMessage.innerHTML = "Usuário ou senha incorretos.";
  }
});
