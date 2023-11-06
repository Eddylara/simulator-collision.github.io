let canvas = document.querySelector("#simu");
let botonni = document.querySelector(".reproduccion");
let ctx = canvas.getContext("2d");
let e = 1;
const botonVisualizar = document.querySelector(".vermodalboton");
let tiempoInicio;
let tiempo = [];
let valores = [];
let valores2 = [];
let grabacionActiva = false;
let intervalo;

const ctx2 = document.getElementById("graph");

function iniciarGrabacion() {
  tiempo = [];
  valores = [];
  valores2 = [];

  tiempoInicio = new Date().getTime();
  grabacionActiva = true;
  intervalo = setInterval(registrarValor, 500);
}

function registrarValor() {
  if (grabacionActiva) {
    const tiempoActual = new Date().getTime();
    const tiempoTranscurrido = tiempoActual - tiempoInicio;
    const valorActual = parseFloat($btnMoment1.value);
    const valorActual2 = parseFloat($btnMoment2.value);
    tiempo.push(tiempoTranscurrido);
    valores.push(valorActual);
    valores2.push(valorActual2);
  }
}

function pausarGrabacion() {
  grabacionActiva = false;
  clearInterval(intervalo);
  tiempo = tiempo.map((e) => parseFloat((e / 1000).toFixed(2)));
  valores = valores.map((e) => parseFloat(e.toFixed(2)));
  valores2 = valores2.map((e) => parseFloat(e.toFixed(2)));
}

// Obtener botones de introduccion
const $btnall = document.querySelectorAll(".inputVal");
const $modal = document.querySelector(".modal");

const $btn1Masa = document.querySelector(".masa-1"),
  $btn2Masa = document.querySelector(".masa-2"),
  $btn1Velox = document.querySelector(".velox-1"),
  $btn2Velox = document.querySelector(".velox-2"),
  $btn1Veloy = document.querySelector(".veloy-1"),
  $btn2Veloy = document.querySelector(".veloy-2"),
  $btnPos1x = document.querySelector(".posx-1"),
  $btnPos2x = document.querySelector(".posx-2"),
  $btnPos1y = document.querySelector(".posy-1"),
  $btnPos2y = document.querySelector(".posy-2"),
  $btnVelo1 = document.querySelector(".velo-1"),
  $btnVelo2 = document.querySelector(".velo-2"),
  $btnMoment1 = document.querySelector(".moment-1"),
  $btnMoment2 = document.querySelector(".moment-2");

// Viewers de la derecha

const $viewEnergia = document.getElementById("viewE"),
  $viewMomento = document.getElementById("viewMoment"),
  $viewVectores = document.getElementById("viewVectores"),
  $rangoBTN = document.getElementById("rangeE"),
  $momentoSistema = document.querySelector(".momentoSis"),
  $energiaSistema = document.querySelector(".energiaSis"),
  $rangoVisor = document.querySelector(".rangoEvisor");

const arch = {
  type: "line",
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    datasets: [
      {
        label: "Cuerpo 1",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 2,
        backgroundColor: "rgba(16, 58, 212, 0.3)",
        borderColor: "#103ad4",
        pointRadius: 0, // Configurado en cero para eliminar los puntos
      },
      {
        label: "Cuerpo 2",
        data: [5, 4, 5, 2, 1],
        borderWidth: 2,
        backgroundColor: "rgba(0, 128, 0, 0.3)",
        borderColor: "green",
        pointRadius: 0, // Configurado en cero para eliminar los puntos
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Momento Lineal [Kgm/s]",
          fontSize: 14,
        },
      },
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Segundos [s]",
          fontSize: 14,
        },
      },
    },
    legend: {
      display: true,
      labels: {
        fontSize: 12,
      },
    },
  },
};

const carita = new Chart(ctx2, arch);

class particula {
  constructor(rad, x, y, velox, veloy, color, masa) {
    this.mostrar = false;
    this.masa = masa;
    this.move = false;
    this.rad = rad;
    this.x = x;
    this.y = y;
    this.isDragging = false;
    this.vector = {
      dibujar: false,
      originx: this.x,
      originy: this.y,
      velox,
      veloy,
    };
    this.color = color;
  }
  dibujar() {
    this.mostrar = true;
  }
  noDibujar() {
    this.mostrar = false;
  }
  desplazar() {
    this.move = true;
  }
  detener() {
    this.move = false;
  }
  dibujarVector() {
    this.vector.dibujar = true;
  }
  borrarVector() {
    this.vector.dibujar = false;
  }
}
const bolitas = [];

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bolitas.length !== 0) {
    bolitas.forEach((elem) => {
      if (elem.x + elem.rad >= canvas.width) {
        if (botonni.classList.contains("fa-stop")) {
          elem.vector.velox = -1 * elem.vector.velox;
        }
        elem.x = canvas.width - elem.rad; // Asegura que la partícula esté dentro del canvas
      }
      if (elem.y + elem.rad >= canvas.height) {
        if (botonni.classList.contains("fa-stop")) {
          elem.vector.veloy = -1 * elem.vector.veloy;
        }
        elem.y = canvas.height - elem.rad; // Asegura que la partícula esté dentro del canvas
      }
      if (elem.x - elem.rad <= 0) {
        if (botonni.classList.contains("fa-stop")) {
          elem.vector.velox = -1 * elem.vector.velox;
        }
        elem.x = elem.rad; // Asegura que la partícula esté dentro del canvas
      }
      if (elem.y - elem.rad <= 0) {
        if (botonni.classList.contains("fa-stop")) {
          elem.vector.veloy = -1 * elem.vector.veloy;
        }
        elem.y = elem.rad; // Asegura que la partícula esté dentro del canvas
      }

      if (!elem.move && !elem.vector.dibujar && elem.mostrar) {
        ctx.beginPath();
        ctx.fillStyle = elem.color;
        ctx.arc(elem.x, elem.y, elem.rad, 0, 2 * Math.PI);
        ctx.fill();
      }
      if (!elem.move && elem.vector.dibujar && elem.mostrar) {
        ctx.beginPath();
        ctx.fillStyle = elem.color;
        ctx.arc(elem.x, elem.y, elem.rad, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = elem.color;
        ctx.moveTo(elem.x, elem.y);
        ctx.lineTo(
          elem.x + elem.vector.velox * 24,
          elem.y + elem.vector.veloy * 24
        );
        ctx.lineWidth = 2;
        ctx.stroke();

        if (elem.vector.velox !== 0 || elem.vector.veloy !== 0) {
          // Calcular las coordenadas de la punta de la flecha
          var arrowX = elem.x + elem.vector.velox * 25;
          var arrowY = elem.y + elem.vector.veloy * 25;

          // Dibujar la punta de la flecha
          ctx.save();
          ctx.translate(arrowX, arrowY);
          ctx.rotate(Math.atan2(elem.vector.veloy, elem.vector.velox));
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-18, -9); // Primer extremo de la flecha
          ctx.lineTo(-18, 9); // Segundo extremo de la flecha
          ctx.closePath();
          ctx.strokeStyle = "black"; // Color del borde
          ctx.lineWidth = 1; // Ancho del borde
          ctx.stroke(); // Dibujar el borde

          ctx.fillStyle = elem.color;
          ctx.fill(); // Llenar la flecha
          ctx.restore();
        }
      }

      if (elem.move && elem.vector.dibujar && elem.mostrar) {
        elem.x += elem.vector.velox;
        elem.y += elem.vector.veloy;
        ctx.beginPath();
        ctx.fillStyle = elem.color;
        ctx.arc(elem.x, elem.y, elem.rad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = elem.color;
        ctx.moveTo(elem.x, elem.y);
        ctx.lineTo(
          elem.x + elem.vector.velox * 24,
          elem.y + elem.vector.veloy * 24
        );
        ctx.lineWidth = 2;
        ctx.stroke();
        if (elem.vector.velox !== 0 || elem.vector.veloy !== 0) {
          // Calcular las coordenadas de la punta de la flecha
          var arrowX = elem.x + elem.vector.velox * 25;
          var arrowY = elem.y + elem.vector.veloy * 25;

          // Dibujar la punta de la flecha
          ctx.save();
          ctx.translate(arrowX, arrowY);
          ctx.rotate(Math.atan2(elem.vector.veloy, elem.vector.velox));
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-18, -9); // Primer extremo de la flecha
          ctx.lineTo(-18, 9); // Segundo extremo de la flecha
          ctx.closePath();
          ctx.strokeStyle = "black"; // Color del borde
          ctx.lineWidth = 1; // Ancho del borde
          ctx.stroke(); // Dibujar el borde

          ctx.fillStyle = elem.color;
          ctx.fill(); // Llenar la flecha
          ctx.restore();
        }
      }
      if (elem.move && !elem.vector.dibujar && elem.mostrar) {
        elem.x += elem.vector.velox;
        elem.y += elem.vector.veloy;
        ctx.beginPath();
        ctx.fillStyle = elem.color;
        ctx.arc(elem.x, elem.y, elem.rad, 0, 2 * Math.PI);
        ctx.fill();
      }
      bolitas.forEach((otraBolita) => {
        if (elem !== otraBolita && detectarColision(elem, otraBolita)) {
          const dx = otraBolita.x - elem.x;
          const dy = otraBolita.y - elem.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const nx = dx / distance;
          const ny = dy / distance;

          const v1n = elem.vector.velox * nx + elem.vector.veloy * ny;
          const v2n =
            otraBolita.vector.velox * nx + otraBolita.vector.veloy * ny;

          let v1t = -elem.vector.velox * ny + elem.vector.veloy * nx;
          let v2t =
            -otraBolita.vector.velox * ny + otraBolita.vector.veloy * nx;
          let v1nFinal =
            (e * (otraBolita.masa - elem.masa) * v1n +
              2 * otraBolita.masa * v2n) /
            (elem.masa + otraBolita.masa);
          let v2nFinal =
            (e * (elem.masa - otraBolita.masa) * v2n + 2 * elem.masa * v1n) /
            (elem.masa + otraBolita.masa);
          console.log(v1nFinal);

          if (botonni.classList.contains("fa-stop")) {
            elem.vector.velox = v1t * -ny + v1nFinal * nx * e;
            elem.vector.veloy = v1t * nx + v1nFinal * ny * e;

            otraBolita.vector.velox = v2t * -ny + v2nFinal * nx * e;
            otraBolita.vector.veloy = v2t * nx + v2nFinal * ny * e;
          }

          const overlap = elem.rad + otraBolita.rad - distance;
          elem.x -= (overlap / 2) * nx;
          elem.y -= (overlap / 2) * ny;
          otraBolita.x += (overlap / 2) * nx;
          otraBolita.y += (overlap / 2) * ny;
        }
      });
    });
  }
  $btnPos1x.value = Math.round(circuloRojo.x - 375);
  $btnPos1y.value = Math.round(circuloRojo.y - 200);
  $btnPos2x.value = Math.round(mideo.x - 375);
  $btnPos2y.value = Math.round(mideo.y - 200);

  $btnMoment1.value =
    Math.sqrt(
      $btn1Velox.value * $btn1Velox.value + $btn1Veloy.value * $btn1Veloy.value
    ).toFixed(1) *
    (circuloRojo.masa / 1000);
  $btnMoment2.value =
    Math.sqrt(
      $btn2Velox.value * $btn2Velox.value + $btn2Veloy.value * $btn2Veloy.value
    ).toFixed(1) *
    (mideo.masa / 1000);
  const MomentoTotal =
    parseFloat($btnMoment1.value) + parseFloat($btnMoment2.value);
  $momentoSistema.textContent = "P = " + MomentoTotal;
  $btnVelo1.value = Math.sqrt(
    $btn1Velox.value * $btn1Velox.value + $btn1Veloy.value * $btn1Veloy.value
  ).toFixed(1);
  $btnVelo2.value = Math.sqrt(
    $btn2Velox.value * $btn2Velox.value + $btn2Veloy.value * $btn2Veloy.value
  ).toFixed(1);

  const EnergiaTotal = (
    0.5 *
    ((circuloRojo.masa / 1000) *
      parseFloat($btnVelo1.value) *
      parseFloat($btnVelo1.value) +
      (mideo.masa / 1000) *
        parseFloat($btnVelo2.value) *
        parseFloat($btnVelo2.value))
  ).toFixed(2);

  $energiaSistema.textContent = "E = " + EnergiaTotal;
  if (botonni.classList.contains("fa-stop")) {
    $btn1Velox.value = ((circuloRojo.vector.velox * 4) / 10).toFixed(1);
    $btn1Veloy.value = ((circuloRojo.vector.veloy * -4) / 10).toFixed(1);
    $btn2Velox.value = ((mideo.vector.velox * 4) / 10).toFixed(1);
    $btn2Veloy.value = ((mideo.vector.veloy * -4) / 10).toFixed(1);
  }
  requestAnimationFrame(animate);
};
const toMasa = (pixeles) => Math.round((1100 / 15) * pixeles - 26000 / 15);
const toPixel = (masa) => Math.round((15 / 1100) * masa + 260 / 11);

const circuloRojo = new particula(toPixel(100), 100, 200, 5, 0, "#103cd4", 100);
const mideo = new particula(toPixel(500), 375, 120, -3, 3, "green", 500);
bolitas.push(circuloRojo, mideo);
const pintarStage = function () {
  bolitas.forEach((e) => {
    e.mostrar = true;
  });
};
const play = function () {
  iniciarGrabacion();
  botonni.classList.remove("fa-play");
  botonni.classList.add("fa-stop");
  bolitas.forEach((e) => {
    e.move = true;
  });
};
const stop = function () {
  if (valores.length > 0) {
    botonVisualizar.classList.remove("disabled");
  }
  if (grabacionActiva) {
    pausarGrabacion();
    carita.data.labels = tiempo;
    carita.data.datasets[0].data = valores;
    carita.data.datasets[1].data = valores2;
    carita.update();
  }
  console.log(tiempo);
  console.log(valores);
  console.log(valores2);
  botonni.classList.contains("fa-play");
  botonni.classList.remove("fa-stop");
  botonni.classList.add("fa-play");
  bolitas.forEach((e) => {
    e.move = false;
  });
};
const pintarVectores = function () {
  bolitas.forEach((e) => {
    e.vector.dibujar = true;
  });
};
const borrarVectores = function () {
  bolitas.forEach((e) => {
    e.vector.dibujar = false;
  });
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".reproduccion") || e.target.matches(".cont-repro")) {
    if (botonni.classList.contains("fa-play")) {
      botonVisualizar.classList.add("disabled");
      play();
    } else {
      stop();
    }
  }

  if (
    e.target === botonVisualizar &&
    !botonVisualizar.classList.contains("disabled")
  ) {
    $modal.classList.add("activemodal");
  }

  if (e.target.matches(".closebottom")) {
    $modal.classList.remove("activemodal");
  }

  if (
    e.target !== botonVisualizar &&
    !e.target.matches("#graph") &&
    !e.target.matches(".container-canvas")
  ) {
    $modal.classList.remove("activemodal");
  }
});

canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  bolitas.forEach((bolita) => {
    if (
      Math.sqrt((mouseX - bolita.x) ** 2 + (mouseY - bolita.y) ** 2) <=
      bolita.rad
    ) {
      stop();
      bolita.isDragging = true;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (bolitas.some((bolita) => bolita.isDragging)) {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    bolitas.forEach((bolita) => {
      if (bolita.isDragging) {
        bolita.x = mouseX;
        bolita.y = mouseY;

        // Evitar que la bolita se salga de los bordes del canvas
        if (bolita.x - bolita.rad < 0) {
          bolita.x = bolita.rad;
        } else if (bolita.x + bolita.rad > canvas.width) {
          bolita.x = canvas.width - bolita.rad;
        }
        if (bolita.y - bolita.rad < 0) {
          bolita.y = bolita.rad;
        } else if (bolita.y + bolita.rad > canvas.height) {
          bolita.y = canvas.height - bolita.rad;
        }
      }
    });
  }
});
canvas.addEventListener("mouseup", () => {
  bolitas.forEach((e) => {
    e.isDragging = false;
  });
});

function detectarColision(bolitaA, bolitaB) {
  const distancia = Math.sqrt(
    (bolitaA.x - bolitaB.x) ** 2 + (bolitaA.y - bolitaB.y) ** 2
  );
  return distancia < bolitaA.rad + bolitaB.rad;
}

$btnall.forEach((e) => {
  e.addEventListener("focus", () => {
    stop();
  });
});
$btnPos1x.value = circuloRojo.x - 375;
$btnPos1y.value = circuloRojo.y - 200;
$btnPos2x.value = mideo.x - 375;
$btnPos2y.value = mideo.y - 200;
$btn1Velox.value = Math.round((circuloRojo.vector.velox * 4) / 10);
$btn1Veloy.value = Math.round((circuloRojo.vector.veloy * 4) / 10);
$btn2Velox.value = Math.round((mideo.vector.velox * 4) / 10);
$btn2Veloy.value = Math.round((mideo.vector.veloy * 4) / 10);
$btn1Masa.value = 0.1;
$btn2Masa.value = 0.5;
$btnMoment1.value =
  (Math.sqrt(
    $btn1Velox.value * $btn1Velox.value + $btn1Veloy.value * $btn1Veloy.value
  ).toFixed(1) *
    circuloRojo.masa) /
  1000;
$btnMoment2.value =
  (Math.sqrt(
    $btn2Velox.value * $btn2Velox.value + $btn2Veloy.value * $btn2Veloy.value
  ).toFixed(1) *
    mideo.masa) /
  1000;

$btn1Velox.addEventListener("input", () => {
  if ($btn1Velox.value > -4 && $btn1Velox.value < 4)
    circuloRojo.vector.velox = ($btn1Velox.value * 10) / 4;
});
$btn1Veloy.addEventListener("input", () => {
  if ($btn1Veloy.value > -4 && $btn1Veloy.value < 4)
    circuloRojo.vector.veloy = (-1 * ($btn1Veloy.value * 10)) / 4;
});
$btn2Velox.addEventListener("input", () => {
  if ($btn2Velox.value > -4 && $btn2Velox.value < 4)
    mideo.vector.velox = ($btn2Velox.value * 10) / 4;
});
$btn2Veloy.addEventListener("input", () => {
  if ($btn2Veloy.value > -4 && $btn2Veloy.value < 4)
    mideo.vector.veloy = (-1 * ($btn2Veloy.value * 10)) / 4;
});
$btn1Masa.addEventListener("input", () => {
  if ($btn1Masa.value > 0 && $btn1Masa.value < 1.2) {
    circuloRojo.masa = $btn1Masa.value * 1000;
    circuloRojo.rad = toPixel($btn1Masa.value * 1000);
  }
});
$btn2Masa.addEventListener("input", () => {
  if ($btn2Masa.value > 0 && $btn2Masa.value < 1.2) {
    mideo.masa = $btn2Masa.value * 1000;
    mideo.rad = toPixel($btn2Masa.value * 1000);
  }
});

$viewEnergia.addEventListener("input", () => {
  if ($viewEnergia.checked) {
    $energiaSistema.classList.remove("disablebb");
  } else $energiaSistema.classList.add("disablebb");
});
$viewMomento.addEventListener("input", () => {
  if ($viewMomento.checked) {
    $momentoSistema.classList.remove("disablebb");
  } else $momentoSistema.classList.add("disablebb");
});
$viewVectores.addEventListener("input", () => {
  if ($viewVectores.checked) {
    pintarVectores();
  } else borrarVectores();
});
$rangoBTN.addEventListener("input", () => {
  $rangoVisor.textContent = $rangoBTN.value + "%";
  e = parseFloat($rangoBTN.value) / 100;
  console.log(e);
});
animate();
pintarStage();
pintarVectores();
