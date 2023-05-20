import { updateState } from "./game.client.js";
import { axis } from "./modules/controls.js";

let socket;
let searching = false;
let searchAnimationInterval;
let onlineUsers = [];

const onlineUsersList = document.getElementById("onlineUsers");
const lblOnlineUsersCount = document.getElementById("lblOnlineUsersCount");

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

document.getElementById("btnGoToRegister").onclick = goToRegister;

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

document.getElementById("btngoToLogin").onclick = goToLogin;

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

function setOnlineUsers(users) {
  onlineUsers = users;
  updateOnlineUsersList();
}

function ConnectWebSocket(token) {
  socket = io(window.location.host, {
    auth: { token },
  });

  socket.on("welcome", (data) => {
    console.log("Server: " + data.message);
    setOnlineUsers(data.onlineUsers);
    lblOnlineUsersCount.innerHTML = data.onlineUsers.length;
    userConnected.innerHTML = ` (${token})`;
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
    divLobby.style.visibility = "hidden";
    console.log("Match ready");
    document.removeEventListener("playerMove", playerMove);
    goToGame();
  });

  socket.on("updateState", function (data) {
    updateState(data);
  });

  socket.on("score", (score) => {
    updateState(score);
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

  socket.on("logout", function () {
    const token = socket.handshake.auth.token;
    delete onlineUsers[token];
    socket.disconnect(true);
  });

  socket.on("onlineUsers", (users) => {
    const onlineUsersList = document.getElementById("onlineUsers");
    onlineUsersList.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = user.username + (user.socketId === socket.id ? " (you)" : "");
      onlineUsersList.appendChild(li);
    });
    const lblOnlineUsersCount = document.getElementById("lblOnlineUsersCount");
    lblOnlineUsersCount.innerText = `${users.length} players online)`;
  });

  function addOnlineUser(username) {
    onlineUsers.push(username);
    updateOnlineUsersList();
  }

  function removeOnlineUser(username) {
    const index = onlineUsers.indexOf(username);
    if (index !== -1) {
      onlineUsers.splice(index, 1);
      updateOnlineUsersList();
    }
  }

  function updateOnlineUsersList() {
    onlineUsersList.innerHTML = "";
    onlineUsers.forEach((user) => {
      const li = document.createElement("li");
      if (user.username === token) {
        li.innerText = "You";
      } else {
        li.innerText = user.username;
      }
      onlineUsersList.appendChild(li);
    });
  }

  document.getElementById("findMatch").addEventListener("click", toggleMatchSearch);

  function toggleMatchSearch() {
    if (!searching) {
      startMatchSearch();
    } else {
      endMatchSearch();
    }
  }

  function startMatchSearch() {
    socket.emit("findMatch"); 
    searching = true;
    searchAnimationInterval = setInterval(searchingAnimation, 400);
    document.getElementById("findMatch").innerHTML = "Cancel";
  }

  function endMatchSearch() {
    socket.emit("stopSearchMatch"); 
    searching = false;
    clearInterval(searchAnimationInterval);
    lblSearching.innerHTML = "";
    document.getElementById("findMatch").innerHTML = "Find Game";
  }

  function playerMove() {
  console.log("player move");
  socket.emit("move", axis);
  }

  document.getElementById("btnLogout").onclick = (e) => {
    socket.emit("disconnected");
    logout();
  };

  setOnlineUsers([]);
}

function goToLobby(token) {
  document.getElementById("divAutenticacion").style.display = "none";
  document.getElementById("divLobby").style.display = "block";
  ConnectWebSocket(token);
}

function goToGame() {
  document.getElementById("divLobby").style.display = "none";
  document.getElementById("divGame").style.display = "block";
}

document.getElementById('formRegistro').onsubmit = async (e) => {
  e.preventDefault();

  let data = {
    username: document.formRegistro.username.value,
    email: document.formRegistro.email.value,
    password: document.formRegistro.password.value
  }

  const resp = await fetch('http://localhost:3000/auth/signup', {
    method: "POST",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (resp.ok) {
    const { token, user } = await resp.json();
    localStorage.setItem("token", token);
    goToLobby(token);
  }
}

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

function searchingAnimation() {
  let searchText = lblSearching.innerHTML;
  if (searchText == "") {
    lblSearching.innerHTML = "Looking for an available game";
  } else if (searchText.split(".").length < 4) {
    lblSearching.innerHTML += ".";
  } else {
    lblSearching.innerHTML = "Looking for an available game";
  }
}

function logout() {
  localStorage.removeItem("token");
  socket.disconnect();
  window.location = "index.html";
}

function disconnect() {
  socket.disconnect();
}