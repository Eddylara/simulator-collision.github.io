let canvas = document.querySelector("#simu"); // Obtengo el lienzo para el simulador

let boton_reproduccion = document.querySelector(".reproduccion"); // Obtengo boton de reproduccion

let ctx = canvas.getContext("2d"); // Contexto para pintar en el canvas

let e = 1; // inn

const btn_graficas = document.querySelector(".vermodalboton"); // Boton que muestra las graficas

let tiempoInicio;
let tiempo = [];
let valores = [];
let valores2 = [];
let grabacionActiva = false;
let intervalo;

const ctx2 = document.getElementById("graph"); // Contexto 2 para la grafica

const toPixel = (masa) => {
  const pixelValue = Math.round((15 / 1100) * masa + 240 / 11);
  return Math.round(pixelValue / 5) * 5; // Redondear al múltiplo de 5 más cercano
};

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
const $btnall = document.querySelectorAll(".inputVal"),
  $modal = document.querySelector(".modal"),
  $btn1Masa = document.querySelector(".masa-1"),
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

// Objeto para las graficas
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

const grafico = new Chart(ctx2, arch);

// Clase de la partircula
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

// Array de particulas
const arr_particulas = [];

const part_1 = new particula(toPixel(100), 100, 200, 5, 0, "#103cd4", 100);
const part_2 = new particula(toPixel(100), 375, 120, -3, -3, "green", 100);

arr_particulas.push(part_1, part_2);
// Funcion que mantiene la particula dentro del Canvas
const mantener_en_canvas = (part) => {
  if (part.x + part.rad >= canvas.width) {
    if (boton_reproduccion.classList.contains("fa-stop")) {
      part.vector.velox = -1 * part.vector.velox;
    }
    part.x = canvas.width - part.rad; // Asegura que la partícula esté dentro del canvas
  }
  if (part.y + part.rad >= canvas.height) {
    if (boton_reproduccion.classList.contains("fa-stop")) {
      part.vector.veloy = -1 * part.vector.veloy;
    }
    part.y = canvas.height - part.rad; // Asegura que la partícula esté dentro del canvas
  }
  if (part.x - part.rad <= 0) {
    if (boton_reproduccion.classList.contains("fa-stop")) {
      part.vector.velox = -1 * part.vector.velox;
    }
    part.x = part.rad; // Asegura que la partícula esté dentro del canvas
  }
  if (part.y - part.rad <= 0) {
    if (boton_reproduccion.classList.contains("fa-stop")) {
      part.vector.veloy = -1 * part.vector.veloy;
    }
    part.y = part.rad; // Asegura que la partícula esté dentro del canvas
  }
};
const dibujar_ctx_particula = (part) => {
  ctx.beginPath();
  ctx.fillStyle = part.color;
  ctx.arc(part.x, part.y, part.rad, 0, 2 * Math.PI);
  ctx.fill();
};
const dibujar_ctx_vector = (part) => {
  ctx.beginPath();
  ctx.fillStyle = part.color;
  ctx.moveTo(part.x, part.y);
  ctx.lineTo(part.x + part.vector.velox * 24, part.y + part.vector.veloy * 24);
  ctx.lineWidth = 2;
  ctx.stroke();

  if (part.vector.velox !== 0 || part.vector.veloy !== 0) {
    // Calcular las coordenadas de la punta de la flecha
    var arrowX = part.x + part.vector.velox * 25;
    var arrowY = part.y + part.vector.veloy * 25;

    // Dibujar la punta de la flecha
    ctx.save();
    ctx.translate(arrowX, arrowY);
    ctx.rotate(Math.atan2(part.vector.veloy, part.vector.velox));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-18, -9); // Primer extremo de la flecha
    ctx.lineTo(-18, 9); // Segundo extremo de la flecha
    ctx.closePath();
    ctx.strokeStyle = "black"; // Color del borde
    ctx.lineWidth = 1; // Ancho del borde
    ctx.stroke(); // Dibujar el borde

    ctx.fillStyle = part.color;
    ctx.fill(); // Llenar la flecha
    ctx.restore();
  }
};
// Funcion que dibuja la particula
const dibuja_particula = (part) => {
  // No se mueve, No se dibuja el vector, Si se muestra
  if (!part.move && !part.vector.dibujar && part.mostrar) {
    dibujar_ctx_particula(part);
  }
  // No se mueve, Si VECTORES, Si se muestra
  if (!part.move && part.vector.dibujar && part.mostrar) {
    dibujar_ctx_particula(part);
    dibujar_ctx_vector(part);
  }
  // Se mueve, Si vectores, Si se muestra
  if (part.move && part.vector.dibujar && part.mostrar) {
    part.x += part.vector.velox;
    part.y += part.vector.veloy;

    dibujar_ctx_particula(part);
    dibujar_ctx_vector(part);
  }
  // Se mueve, No vectores, Si se muestra
  if (part.move && !part.vector.dibujar && part.mostrar) {
    part.x += part.vector.velox;
    part.y += part.vector.veloy;

    dibujar_ctx_particula(part);
  }
};

// Funcion que realiza la colision
const animar_colision = () => {
  if (detectarColision(part_1, part_2)) {
    const dx = part_2.x - part_1.x;
    const dy = part_2.y - part_1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // VECTOR UNITARIO NORMAL
    const nx = dx / distance;
    const ny = dy / distance;

    // Velocidades antes
    const pre_vel_x_1 = parseFloat($btn1Velox.value);
    const pre_vel_y_1 = parseFloat($btn1Veloy.value);

    const pre_vel_x_2 = parseFloat($btn2Velox.value);
    const pre_vel_y_2 = parseFloat($btn2Veloy.value);

    const v1n = part_1.vector.velox * nx + part_1.vector.veloy * ny;

    const v2n = part_2.vector.velox * nx + part_2.vector.veloy * ny;

    let v1t = -part_1.vector.velox * ny + part_1.vector.veloy * nx;

    let v2t = -part_2.vector.velox * ny + part_2.vector.veloy * nx;

    let v1nFinal =
      (part_1.masa * v1n +
        part_2.masa * v2n -
        part_2.masa * e * v1n +
        part_2.masa * e * v2n) /
      (part_1.masa + part_2.masa);

    /*let v1nFinal =
            (e * (part_2.masa - part_1.masa) * v1n +
              2 * part_2.masa * v2n) /
            (part_1.masa + part_2.masa);*/
    let v2nFinal =
      (part_1.masa * v1n +
        part_2.masa * v2n +
        part_1.masa * e * v1n -
        part_1.masa * e * v2n) /
      (part_1.masa + part_2.masa);
    /*let v2nFinal =
            (e * (part_1.masa - part_2.masa) * v2n + 2 * part_1.masa * v1n) /
            (part_1.masa + part_2.masa);*/

    if (boton_reproduccion.classList.contains("fa-stop")) {
      part_1.vector.velox = v1t * -ny + v1nFinal * nx;
      part_1.vector.veloy = v1t * nx + v1nFinal * ny;

      part_2.vector.velox = v2t * -ny + v2nFinal * nx;
      part_2.vector.veloy = v2t * nx + v2nFinal * ny;
    }
    const obj_dx = part_2.x - part_1.x - 50;
    const obj_dy = part_1.y - part_2.y;
    const obj_distance = Math.sqrt(obj_dx * obj_dx + obj_dy * obj_dy);
    const obj_nx = obj_dx / obj_distance;
    const obj_ny = obj_dy / obj_distance;
    const obj_proy_tang_1 = -pre_vel_x_1 * obj_ny + pre_vel_y_1 * obj_nx;
    const obj_proy_norm_1 = pre_vel_x_1 * obj_nx + pre_vel_y_1 * obj_ny;
    const obj_proy_tang_2 = -pre_vel_x_2 * obj_ny + pre_vel_y_2 * obj_nx;
    const obj_proy_norm_2 = pre_vel_x_2 * obj_nx + pre_vel_y_2 * obj_ny;

    const colission_info = {
      particulas: [part_1, part_2],
      e,
      shock_part1: {
        coord_x: part_1.x - 360,
        coord_y: -(part_1.y - 200),
        velo_pre: { x: pre_vel_x_1, y: pre_vel_y_1 },
        velo_pre_mod: redondeo_cientifico(
          Math.sqrt(pre_vel_x_1 * pre_vel_x_1 + pre_vel_y_1 * pre_vel_y_1)
        ),
        velo_post: {
          x: redondeo_cientifico((part_1.vector.velox * 4) / 10),
          y: redondeo_cientifico((part_1.vector.veloy * -4) / 10),
        },
      },
      shock_part2: {
        coord_x: part_2.x - 410,
        coord_y: -(part_2.y - 200),
        velo_pre: { x: pre_vel_x_2, y: pre_vel_y_2 },
        velo_pre_mod: redondeo_cientifico(
          Math.sqrt(pre_vel_x_2 * pre_vel_x_2 + pre_vel_y_2 * pre_vel_y_2)
        ),
        velo_post: {
          x: redondeo_cientifico((part_2.vector.velox * 4) / 10),
          y: redondeo_cientifico((part_2.vector.veloy * -4) / 10),
        },
      },
      vect_unit_linea_impacto: { x: obj_nx, y: obj_ny },
      vect_unit_plano_contacto: { x: -obj_ny, y: obj_nx },
      proyecciones: {
        obj_proy_norm_1,
        obj_proy_norm_2,
        obj_proy_tang_1,
        obj_proy_tang_2,
      },
    };

    console.log(colission_info);

    const overlap = part_1.rad + part_2.rad - distance;
    part_1.x -= (overlap / 2) * nx;
    part_1.y -= (overlap / 2) * ny;
    part_2.x += (overlap / 2) * nx;
    part_2.y += (overlap / 2) * ny;
  }
};
const redondeo_cientifico = (num) => {
  return Math.round(num.toFixed(5) * 10000) / 10000;
};
// FUNCION DE ANIMACION OJO OJO
const animate = () => {
  // Limpiar el lienzo
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Mantener en el canvas a las particulas
  mantener_en_canvas(part_1);
  mantener_en_canvas(part_2);
  // Dibujar a las particulas
  dibuja_particula(part_1);
  dibuja_particula(part_2);
  // Verificar y animar colision colision
  animar_colision();

  // VALORES
  $btnPos1x.value = Math.round(part_1.x - 360);
  $btnPos1y.value = -1 * Math.round(part_1.y - 200);
  $btnPos2x.value = Math.round(part_2.x - 410);
  $btnPos2y.value = -1 * Math.round(part_2.y - 200);

  $btnMoment1.value = redondeo_cientifico(
    Math.sqrt(
      $btn1Velox.value * $btn1Velox.value + $btn1Veloy.value * $btn1Veloy.value
    ) *
      (part_1.masa / 1000)
  );
  $btnMoment2.value = redondeo_cientifico(
    Math.sqrt(
      $btn2Velox.value * $btn2Velox.value + $btn2Veloy.value * $btn2Veloy.value
    ) *
      (part_2.masa / 1000)
  );
  const MomentoTotal =
    parseFloat($btnMoment1.value) + parseFloat($btnMoment2.value);

  $momentoSistema.textContent =
    "P = " + redondeo_cientifico(MomentoTotal) + " kgm/s";

  $btnVelo1.value = redondeo_cientifico(
    Math.sqrt(
      $btn1Velox.value * $btn1Velox.value + $btn1Veloy.value * $btn1Veloy.value
    )
  );
  $btnVelo2.value = redondeo_cientifico(
    Math.sqrt(
      $btn2Velox.value * $btn2Velox.value + $btn2Veloy.value * $btn2Veloy.value
    )
  );

  const EnergiaTotal = redondeo_cientifico(
    0.5 *
      ((part_1.masa / 1000) *
        parseFloat($btnVelo1.value) *
        parseFloat($btnVelo1.value) +
        (part_2.masa / 1000) *
          parseFloat($btnVelo2.value) *
          parseFloat($btnVelo2.value))
  );

  $energiaSistema.textContent = "E = " + EnergiaTotal + " J";
  if (boton_reproduccion.classList.contains("fa-stop")) {
    $btn1Velox.value = redondeo_cientifico((part_1.vector.velox * 4) / 10);
    $btn1Veloy.value = redondeo_cientifico((part_1.vector.veloy * -4) / 10);
    $btn2Velox.value = redondeo_cientifico((part_2.vector.velox * 4) / 10);
    $btn2Veloy.value = redondeo_cientifico((part_2.vector.veloy * -4) / 10);
  }
  requestAnimationFrame(animate);
};

const pintarStage = function () {
  part_1.mostrar = true;
  part_2.mostrar = true;
};
const play = function () {
  iniciarGrabacion();
  boton_reproduccion.classList.remove("fa-play");
  boton_reproduccion.classList.add("fa-stop");
  part_1.move = true;
  part_2.move = true;
};
const stop = function () {
  if (valores.length > 0) {
    btn_graficas.classList.remove("disabled");
  }
  if (grabacionActiva) {
    pausarGrabacion();
    grafico.data.labels = tiempo;
    grafico.data.datasets[0].data = valores;
    grafico.data.datasets[1].data = valores2;
    grafico.update();
  }

  boton_reproduccion.classList.contains("fa-play");
  boton_reproduccion.classList.remove("fa-stop");
  boton_reproduccion.classList.add("fa-play");
  arr_particulas.forEach((e) => {
    e.move = false;
  });
};
const pintarVectores = function () {
  arr_particulas.forEach((e) => {
    e.vector.dibujar = true;
  });
};
const borrarVectores = function () {
  arr_particulas.forEach((e) => {
    e.vector.dibujar = false;
  });
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".reproduccion") || e.target.matches(".cont-repro")) {
    if (boton_reproduccion.classList.contains("fa-play")) {
      btn_graficas.classList.add("disabled");
      play();
    } else {
      stop();
    }
  }

  if (
    e.target === btn_graficas &&
    !btn_graficas.classList.contains("disabled")
  ) {
    $modal.classList.add("activemodal");
  }

  if (e.target.matches(".closebottom")) {
    $modal.classList.remove("activemodal");
  }

  if (
    e.target !== btn_graficas &&
    !e.target.matches("#graph") &&
    !e.target.matches(".container-canvas")
  ) {
    $modal.classList.remove("activemodal");
  }
});

canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  arr_particulas.forEach((bolita) => {
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
  // Obtener la posición del mouse en el canvas
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  // Verificar si alguna partícula está siendo arrastrada
  arr_particulas.forEach((bolita) => {
    if (bolita.isDragging) {
      // Actualizar la posición de la bolita en múltiplos de 5
      bolita.x = Math.round(mouseX / 5) * 5;
      bolita.y = Math.round(mouseY / 5) * 5;

      // Restringir la posición dentro de los bordes del canvas
      bolita.x = Math.max(
        bolita.rad,
        Math.min(canvas.width - bolita.rad, bolita.x)
      );
      bolita.y = Math.max(
        bolita.rad,
        Math.min(canvas.height - bolita.rad, bolita.y)
      );
    }
  });
});

canvas.addEventListener("mouseup", () => {
  arr_particulas.forEach((e) => {
    e.isDragging = false;
  });
});

function detectarColision(bolitaA, bolitaB) {
  const distancia = Math.sqrt(
    (bolitaA.x - bolitaB.x) ** 2 + (bolitaA.y - bolitaB.y) ** 2
  );
  return distancia <= bolitaA.rad + bolitaB.rad;
}

$btnall.forEach((e) => {
  e.addEventListener("focus", () => {
    stop();
  });
});

$btnPos1x.value = part_1.x - 375;
$btnPos1y.value = part_1.y - 200;
$btnPos2x.value = part_2.x - 375;
$btnPos2y.value = part_2.y - 200;
$btn1Velox.value = redondeo_cientifico((part_1.vector.velox * 4) / 10);
$btn1Veloy.value = redondeo_cientifico((part_1.vector.veloy * 4) / 10);
$btn2Velox.value = redondeo_cientifico((part_2.vector.velox * 4) / 10);
$btn2Veloy.value = -1 * redondeo_cientifico((part_2.vector.veloy * 4) / 10);
$btn1Masa.value = 0.1;
$btn2Masa.value = 0.1;
$btnMoment1.value =
  (Math.sqrt(
    $btn1Velox.value * $btn1Velox.value + $btn1Veloy.value * $btn1Veloy.value
  ).toFixed(1) *
    part_1.masa) /
  1000;
$btnMoment2.value =
  (Math.sqrt(
    $btn2Velox.value * $btn2Velox.value + $btn2Veloy.value * $btn2Veloy.value
  ).toFixed(1) *
    part_2.masa) /
  1000;

$btn1Velox.addEventListener("input", () => {
  if ($btn1Velox.value >= -4 && $btn1Velox.value <= 4)
    part_1.vector.velox = ($btn1Velox.value * 10) / 4;
});
$btn1Veloy.addEventListener("input", () => {
  if ($btn1Veloy.value >= -4 && $btn1Veloy.value <= 4)
    part_1.vector.veloy = (-1 * ($btn1Veloy.value * 10)) / 4;
});
$btn2Velox.addEventListener("input", () => {
  if ($btn2Velox.value >= -4 && $btn2Velox.value <= 4)
    part_2.vector.velox = ($btn2Velox.value * 10) / 4;
});
$btn2Veloy.addEventListener("input", () => {
  if ($btn2Veloy.value >= -4 && $btn2Veloy.value <= 4)
    part_2.vector.veloy = (-1 * ($btn2Veloy.value * 10)) / 4;
});
$btn1Masa.addEventListener("input", () => {
  if ($btn1Masa.value > 0 && $btn1Masa.value < 1.2) {
    part_1.masa = $btn1Masa.value * 1000;
    part_1.rad = toPixel($btn1Masa.value * 1000);
  }
});
$btn2Masa.addEventListener("input", () => {
  if ($btn2Masa.value > 0 && $btn2Masa.value < 1.2) {
    part_2.masa = $btn2Masa.value * 1000;
    part_2.rad = toPixel($btn2Masa.value * 1000);
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
});
animate();
pintarStage();
pintarVectores();
