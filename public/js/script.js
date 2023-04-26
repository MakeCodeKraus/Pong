//  document.getElementById('btnGoToRegister').onclick = goToRegister;
import { updateState } from "./game.client.js";
import { axis } from "./modules/controls.js";
let socket;

CheckToken();

function goToRegister() {
  document.getElementById("panelLogin").classList.add("animate__fadeOutLeft");
  setTimeout(() => {
    document.getElementById("panelLogin").classList.add("hide");
    document
      .getElementById("panelRegistro")
      .classList.remove("hide", "animate__fadeOutRight");
    document
      .getElementById("panelRegistro")
      .classList.add("animate__fadeInRight");
  }, 550);
}

function goToLogin() {
  document
    .getElementById("panelRegistro")
    .classList.add("animate__fadeOutRight");
  setTimeout(() => {
    document.getElementById("panelRegistro").classList.add("hide");
    document
      .getElementById("panelLogin")
      .classList.remove("hide", "animate__fadeOutLeft");
    document.getElementById("panelLogin").classList.add("animate__fadeInLeft");
  }, 550);
}
async function CheckToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }
  const resp = await fetch("/auth/check", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-token": token,
    },
  });
  if (resp.ok) {
    goToLobby(token);
  }
}
function ConnectWebSocket(token) {
  socket = io(window.location.host, {
    auth: { token },
  });

  socket.on("welcome", (data) => {
    console.log("Server: " + data.message);
    setOnlineUsers(data.onlineUsers);
    lblOnlineUsersCount.innerHTML = data.onlineUsers.length;
  });

  socket.on("userConnected", (data) => {
    console.log(data.username + " se ha conectado");
    addOnlineUser(data.username);
    lblOnlineUsersCount.innerHTML = Number(lblOnlineUsersCount.innerHTML) + 1;
  });

  socket.on("userDisconnected", (data) => {
    console.log(data.username + " se ha desconectado");
    lblOnlineUsersCount.innerHTML = Number(lblOnlineUsersCount.innerHTML) - 1;
    removeOnlineUser(data.username);
  });

  socket.on("MatchReady", function (data) {
    // divLobby.style.visibility = "hidden";
    // divGame.style.visibility = "visible";
    console.log("Match ready");
    document.addEventListener("playerMove", playerMove);
  });
  socket.on("updateState", function (data) {
    // console.log(data);
    updateState(data);
  });
  socket.on("connectionRejected", function (resp) {
    console.log("Desconectado", resp);
    window.location = "index.html";
  });
  socket.on("disconnected", function (reason) {
    console.log(reason);
  });
  socket.on("error", function (reason) {
    console.log(reason);
  });

  document.getElementById("findMatch").onclick = (e) => {
    socket.emit("FindMatch");
  };
}
function goToLobby(token) {
  document.getElementById("divAutenticacion").style.display = "none";
  document.getElementById("divLobby").style.display = "block";
  ConnectWebSocket(token);
}
function playerMove() {
  console.log("player move");
  socket.emit("move", axis);
}

document.getElementById("formRegistro").onsubmit = (e) => {
  e.preventDefault();
  console.log("Registro");
};

document.getElementById("formLogin").onsubmit = async (e) => {
  e.preventDefault();

  let data = {
    email: document.formLogin.username.value,
    password: document.formLogin.password.value,
  };

  const resp = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (resp.ok) {
    const { token, user } = await resp.json();
    localStorage.setItem("token", token);
    goToLobby(token);
  }
};
