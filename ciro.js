const http = require("http");

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Ciro - Juego Espacial</title>
<style>
body {
  background: #020617;
  color: white;
  text-align: center;
  font-family: Arial;
}
canvas {
  background: #0f172a;
  border: 3px solid #38bdf8;
  max-width: 95%;
}
</style>
</head>
<body>
<h1>🚀 CIRO: SUPERVIVENCIA ESPACIAL</h1>
<p>Movete con las flechas o WASD y esquivá los meteoritos.</p>
<canvas id="game" width="800" height="500"></canvas>
<p id="info">Puntos: 0</p>
<p>Si perdés, presioná ENTER para reiniciar.</p>

<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");

let player, enemies, score, over, spawn, last;
const keys = {};

function reset() {
  player = {x:400, y:400, size:22, speed:280};
  enemies = [];
  score = 0;
  over = false;
  spawn = 0;
  last = performance.now();
}

document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
  if (over && e.key === "Enter") reset();
  if (e.key.startsWith("Arrow")) e.preventDefault();
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  ctx.clearRect(0, 0, 800, 500);

  // Estrellas
  ctx.fillStyle = "white";
  for (let i = 0; i < 60; i++) {
    const x = (i * 137) % 800;
    const y = (i * 83 + now * 0.03) % 500;
    ctx.fillRect(x, y, 2, 2);
  }

  if (!over) {
    if (keys.arrowleft || keys.a) player.x -= player.speed * dt;
    if (keys.arrowright || keys.d) player.x += player.speed * dt;
    if (keys.arrowup || keys.w) player.y -= player.speed * dt;
    if (keys.arrowdown || keys.s) player.y += player.speed * dt;

    player.x = Math.max(20, Math.min(780, player.x));
    player.y = Math.max(20, Math.min(480, player.y));

    spawn += dt;
    if (spawn > 0.65) {
      enemies.push({
        x: 20 + Math.random() * 760,
        y: -20,
        speed: 150 + Math.random() * 100 + score
      });
      spawn = 0;
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.y += e.speed * dt;

      if (Math.hypot(e.x - player.x, e.y - player.y) < 30) {
        over = true;
      }

      if (e.y > 530) {
        enemies.splice(i, 1);
        score += 10;
      }
    }

    score += dt;
  }

  // Nave
  ctx.font = "32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🚀", player.x, player.y + 10);

  // Meteoritos
  for (const e of enemies) {
    ctx.fillText("☄️", e.x, e.y);
  }

  info.textContent = "⭐ Puntos: " + Math.floor(score);

  if (over) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = "#fb7185";
    ctx.font = "bold 48px Arial";
    ctx.fillText("GAME OVER", 400, 220);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Presioná ENTER para reiniciar", 400, 280);
  }

  requestAnimationFrame(loop);
}

reset();
requestAnimationFrame(loop);
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
  res.end(html);
});

server.listen(3000, () => {
  console.log("Juego listo en http://localhost:3000");
  console.log("Abrí ese enlace en Chrome para jugar.");
});