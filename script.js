
var ctx = document.getElementById('grafico').getContext('2d');
var lineasHorizontales = [];

function dibujarLineasHorizontales() {
  var lineasDiv = document.getElementById('lineas-horizontales');
  lineasDiv.innerHTML = ''; // Limpiar el contenido anterior

  lineasHorizontales.forEach(function (linea, index) {
    var lineaDiv = document.createElement('div');
    lineaDiv.className = 'linea-horizontal';
    lineaDiv.style.top = linea.y + 'px';
    lineaDiv.style.backgroundColor = linea.color;

    // Agregar un atributo data-index con el índice de la línea para identificarla
    lineaDiv.setAttribute('data-index', index);

    lineasDiv.appendChild(lineaDiv);

    // Agregar un evento clic para eliminar la línea al hacer clic en ella
    lineaDiv.addEventListener('click', function (event) {
      var index = parseInt(event.currentTarget.getAttribute('data-index'), 10);
      lineasHorizontales.splice(index, 1); // Eliminar la línea del array
      dibujarLineasHorizontales(); // Volver a dibujar las líneas sin la línea eliminada
    });
  });
}

function agregarLineaHorizontal(event) {
  var canvasRect = canvasElement.getBoundingClientRect();
  var y = event.clientY - canvasRect.top + window.scrollY + 45; // Ajustar la posición Y

  lineasHorizontales.push({ y: y, color: 'yellow' });
  dibujarLineasHorizontales();
}

var canvasElement = document.getElementById('grafico');
canvasElement.addEventListener('click', agregarLineaHorizontal);

var data = {
  labels: ['1'],
  datasets: [{
    label: '',
    data: [1],
    borderColor: ['rgb(255, 255, 255)'],
    backgroundColor: ['rgba(52, 180, 255, 0.2)'],
    pointBackgroundColor: ['rgba(52, 180, 255, 1)'],
    pointBorderColor: ['rgba(255, 255, 255, 0)'],
    pointRadius: 5,
    pointHoverRadius: 6,
    borderWidth: 3,
    fill: false
  }]
};
var options = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.2)'
      }
    }
  },
  plugins: {
    title: {
      display: true,
      font: {
        size: 32,
        weight: 'bold',
        family: 'Arial, sans-serif'
      },
      padding: {
        top: 10
      },
      color: 'white',
    }
  }
};
var chart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: options
});

/*const containerBody = document.querySelector(".containerBody")
const totallabels=chart.data.labels.length

if(totallabels > 7){
  const newWidth = 700 + ((totallabels -7)* 30)
  containerBody.style.width ="800px"
}
*/

const containerBody = document.querySelector(".containerBody")
totallabels = chart.data.labels.length
ancho=850
containerBody.style.width=ancho+"px"

function moverLinea(delta, rosa) {
  totallabels = chart.data.labels.length

  if (totallabels > 7) {
    const newWidth = 700 + ((totallabels - 7) * 30)
    ancho=ancho+50
    containerBody.style.width = ancho+"px"
    containerBody.scrollIntoView({behavior: 'smooth', inline: 'end'});
  }

  var valorActual = data.datasets[0].data[data.datasets[0].data.length - 1];
  var nuevoValor = valorActual + delta;
  data.labels.push('');
  data.datasets[0].data.push(nuevoValor);

  var colorActual = data.datasets[0].borderColor[data.datasets[0].borderColor.length - 1];
  data.datasets[0].borderColor.push(colorActual);

  if (rosa) {
    data.datasets[0].pointBackgroundColor.push('rgb(192, 23, 180)');
    data.datasets[0].borderColor.push('rgba(255, 0, 127, 1)');
  } else {
    console.log(nuevoValor)
    console.log(valorActual)
    if (nuevoValor > valorActual) { //arriba morado
      data.datasets[0].pointBackgroundColor.push('rgb(145, 62, 248)');
      //data.datasets[0].borderColor.push('rgb(255, 255, 255)');
      data.datasets[0].borderColor.push('rgb(145, 62, 248)');
    }
    if (nuevoValor < valorActual) { //abajo azul
      data.datasets[0].pointBackgroundColor.push('rgb(52, 180, 255)');
      //data.datasets[0].borderColor.push('rgb(255, 255, 255)');
      data.datasets[0].borderColor.push('blue');
    }
    if (nuevoValor == valorActual) {
      data.datasets[0].pointBackgroundColor.push('rgb(192, 23, 180)');
      //data.datasets[0].pointBackgroundColor.push('rgba(52, 180, 255, 1)');
      //data.datasets[0].borderColor.push('rgb(255, 255, 255)');
      data.datasets[0].borderColor.push('rgb(192, 23, 180)');
    }

  }

  chart.update();
}

var urlBase = "https://aviatornetwork-aviatornetwork.vercel.app/";

function checkList(listOne, listTwo) {
  for (let index = 0; index < listOne.length; index++) {
    if (listOne[index] !== listTwo[index]) {
      return false;
    }
  }
  return true;
}

async function getValuesFromApi(url) {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(`Error with the communication with the api: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Función para verificar el patrón de entrada
function verificarPatronEntrada(coeficientes) {
  // Verificar si hay al menos 5 coeficientes disponibles
  if (coeficientes.length < 5) {
    return false;
  }

  // Obtener los últimos 5 coeficientes
  const ultimos5Coeficientes = coeficientes.slice(-5);

  // Calcular la suma de los últimos 5 coeficientes
  const sumaUltimos5 = ultimos5Coeficientes.reduce((total, coeficiente) => total + coeficiente, 0);

  // Verificar si el patrón se cumple (2-2-2-2-2-1.75 = 2.5)
  if (sumaUltimos5 === 2.5) {
    return true;
  }

  return false;
}
// Función para verificar la estrategia
function verificarEstrategia(coeficientes) {
  // Verificar si hay al menos 10 coeficientes disponibles
  if (coeficientes.length < 10) {
    return false;
  }

  // Obtener los últimos 5 y 10 coeficientes
  const ultimos5Coeficientes = coeficientes.slice(-5);
  const ultimos10Coeficientes = coeficientes.slice(-10);

  // Calcular la suma de los últimos 5 y 10 coeficientes
  const sumaUltimos5 = ultimos5Coeficientes.reduce((total, coeficiente) => total + coeficiente, 0);
  const sumaUltimos10 = ultimos10Coeficientes.reduce((total, coeficiente) => total + coeficiente, 0);

  // Verificar si la estrategia se cumple
  if ((sumaUltimos5 > 5.00 && sumaUltimos5 < 10.00) || (sumaUltimos10 > 10.00 && sumaUltimos10 < 15.00)) {
    return true;
  }

  return false;
}

function mostrarAlertaEntrada() {
  const alertaEntradaElement = document.getElementById('alerta-entrada');
  alertaEntradaElement.textContent = '¡Coeficiente 3.00x - 10.00x detectado!'; // Mensaje de alerta
  alertaEntradaElement.style.display = 'block'; // Mostrar la alerta

  // Reproducir el sonido
  const alertaAudio = document.getElementById('alertaAudio');
  alertaAudio.play();

  setTimeout(() => {
    alertaEntradaElement.style.display = 'none'; // Ocultar la alerta después de 5 segundos
  }, 10000);
}


const resultadoApiElement = document.getElementById('resultado-api');

async function show() {
  var firstRun = true;
  var dataResult = { "results": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
  var resultadosAnteriores = [];

  while (true) {
    const blazeCash = await getValuesFromApi(urlBase);

    if (!blazeCash) {
      console.error("No se pudo obtener datos de la API");
      continue;
    }

    const blazeCashList = blazeCash['results'];
    blazeCashList.reverse();

    if (!checkList(dataResult['results'], blazeCashList)) {
      console.log("INFORMATION: SE HAN VISTO CAMBIOS!");
      if (firstRun) {

        console.log(`GET VALUES: ${blazeCashList}`);
        console.log(`GET VALUES PREVIOUS: ${dataResult['results']}`);

        for (let index = 0; index < blazeCashList.length; index++) {
          let value = blazeCashList[index];

          if (1 <= value && value < 2) {
            moverLinea(-1);
          } else if (value >= 2) {
            moverLinea(1);
          }

          const div = document.createElement('div');
          div.className = 'valor-especial bubble-multiplier'; // Agregar la clase "bubble-multiplier" además de "valor-especial"
          div.textContent = value;
          if (value >= 0.00 && value <= 1.99) {
            div.style.color = "rgb(52, 180, 255)";
          }
          if (value >= 2 && value <= 9.99) {
            div.style.color = "rgb(145, 62, 248)";
          }
          if (value >= 10) {
            div.style.color = "rgb(192, 23, 180)";
            div.classList.add('font-weight-bold'); // Agregar la clase "font-weight-bold"
          }
          resultadosAnteriores.unshift(div);
        }

        firstRun = false;
      } else {
        const value = blazeCashList[blazeCashList.length - 1];

        console.log(`GET VALUE: ${value}`);
        console.log(`GET VALUE PREVIOUS: ${dataResult['results'][0]}`);

        if (1 <= value && value < 2) {
          moverLinea(-1);
        } else if (value >= 2) {
          moverLinea(1);
        }

        const div = document.createElement('div');
        div.className = 'valor-especial bubble-multiplier'; // Agregar la clase "bubble-multiplier" además de "valor-especial"
        div.textContent = value;
        if (value >= 0.00 && value <= 1.99) {
          div.style.color = "rgb(52, 180, 255)";
        }
        if (value >= 2 && value <= 9.99) {
          div.style.color = "rgb(145, 62, 248)";
        }
        if (value >= 10) {
          div.style.color = "rgb(192, 23, 180)";
          div.classList.add('font-weight-bold'); // Agregar la clase "font-weight-bold"
        }
        resultadosAnteriores.unshift(div);

        resultadosAnteriores.unshift(div);

        // Verificar el patrón de entrada
        if (verificarPatronEntrada(blazeCashList)) {
          mostrarMensajeEntrada();
        }

        // Verificar la estrategia
        if (verificarEstrategia(blazeCashList)) {
          mostrarAlertaEntrada();
        }
      }
    }
    dataResult['results'] = blazeCashList;

    const resultadoApiElement = document.getElementById('resultado-api');
    resultadoApiElement.innerHTML = '';

    resultadosAnteriores.forEach(div => {
      resultadoApiElement.appendChild(div);
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

show();

