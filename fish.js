
//Si da un limite alle variabili del file json

const xMin = 5;
const xMax = window.innerWidth - 300;

const yMin = 5;
const yMax = window.innerHeight - 90;

const bodyDimMin = 100;
const bodyDimMax = 200;

const armDimMin = 10;
const armDimMax = 100;

const eyeDimMin = 10;
const eyeDimMax = 50;

//background dei pesciolini
var svg = d3.select("body")
  .append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  .style("background-color", "#1a28db");



var fishes = []


/*funzione utile per lo scambio di variabili*/
function swapAttr(fishes, attr1, attr2) {
  for (let i = 0; i < fishes.length; i++) {
    let a = fishes[i][attr1];
    let b = fishes[i][attr2];
    fishes[i][attr1] = b;
    fishes[i][attr2] = a;
  }

  return fishes;
}
/*questo tipo di funzione serve per gestire il click da tastiera della X e della Y :
se viene premuta la X viene richiamata la funzione swap Attribute che scambia , una volta premuta su 
una caratteristica di un pesciolino e il tasto , le variabili relative a quella caratteristica
con la coordinata X con quella di tutti i pesciolini. La stessa cosa accade con la Y
 */

function handleClick(attr) {

  return function () {
    let X = 88;
    let Y = 89;

    if (keyPressed[X]) {
      fishes = swapAttr(fishes, 'x', attr);

      for (let i = 0; i < fishes.length; i++)
        modifyFish(drawnFishes[i], fishes[i]);

    }
    if (keyPressed[Y]) {
      fishes = swapAttr(fishes, 'y', attr);

      for (let i = 0; i < fishes.length; i++)
        modifyFish(drawnFishes[i], fishes[i]);
    }
  }
}


// Handle Keyboard
var keyPressed = {};

d3.select("body")
  .on('keydown', function () {
    keyPressed[event.keyCode] = true;
  })
  .on('keyup', function () {
    keyPressed[event.keyCode] = false;
  });

/*funzioni con le quali vengono create le caratteristiche del pesce*/

function createCircle(x, y, r, color, callback) {

  let circle = svg.append("circle").attr('cx', x)
    .attr('cy', y)
    .attr('r', r)
    .attr('stroke', color)
    .attr('fill', color)
    .on('click', callback);

  return circle;

}


function createEllipse(x, y, width, height, callback) {
  return svg.append('ellipse')
    .attr('cx', x + width / 2)
    .attr('cy', y + height / 2)
    .attr('rx', width / 2)
    .attr('ry', height / 2)
    .attr('stroke', '#000')
    .attr('stroke-width', '4')
    .attr('fill', '#AA6BEA')
    .on('click', callback);
}

function createTriangle(x, y, dim, callback) {

  let triangle = svg.append('path')
    .attr('d', 'M ' + x + ' ' + y + ' l ' + dim + ' -' + dim / 2 + ' l ' + 0 + ' ' + dim + ' Z')
    .attr('stroke', '#000')
    .attr('fill', '#000')
    .on('click', callback);

  return triangle;

}

//  funzione 
function modifyCircle(circle, x, y, r, color) {

  circle.transition().duration(1500).attr('cx', x)
    .attr('cy', y)
    .attr('r', r)
    .attr('stroke', color)
    .attr('fill', color);

}


function modifyEllipse(Ellipseangle, x, y, width, height) {

  Ellipseangle.transition().duration(1500).attr('cx', x + width / 2)
    .attr('cy', y + height / 2)
    .attr('rx', width / 2)
    .attr('ry', height / 2)
    .attr('stroke', '#000')
    .attr('stroke-width', '4')
    .attr('fill', '#AA6BEA');

}

function modifyTriangle(triangle, x, y, dim) {

  triangle.transition().duration(1500)
    .attr('d', 'M ' + x + ' ' + y + ' l ' + dim + ' -' + dim / 2 + ' l ' + 0 + ' ' + dim + ' Z')
    .attr('stroke', '#000')
    .attr('fill', '#000');

}

/*vengono creati i pesci ed effettuata una mappatura: i valori sono normalizzati in un range che va da 0 a 1.
viene fatta quests operazione poichè nel momento in cui si vanno a scambiare i valori 
si rischia di lavorare con variabili troppo grandi*/

function createFish(fish) {
  console.log(fish.x);
  let scale = (min, max, value) => d3.scaleLinear()
    .domain([0, 1])
    .range([min, max])(value);

  let x = scale(xMin, xMax, fish.x);
  let y = scale(yMin, yMax, fish.y);
  let bodyDim = scale(bodyDimMin, bodyDimMax, fish.bodyDim);
  let armDim = scale(armDimMin, armDimMax, fish.armDim);
  let eyeDim = scale(eyeDimMin, eyeDimMax, fish.eyeDim);

  let bodyHeight = bodyDim * 0.3;


  let arm = createTriangle(x + bodyDim - armDim * 0.55,
    y + bodyHeight / 2,
    armDim,
    handleClick('armDim'));

  let body = createEllipse(x,
    y,
    bodyDim,
    bodyHeight,
    handleClick('bodyDim'));

  let eyeBig = createCircle(x + bodyDim / 5,
    y + bodyHeight / 2,
    eyeDim, '#fff',
    handleClick('eyeDim'));

  let eyeSmall = createCircle(x + bodyDim / 5,
    y + bodyHeight / 2,
    eyeDim / 2, '#222',
    handleClick('eyeDim'));

  return {
    'body': body,
    'arm': arm,
    'eyeBig': eyeBig,
    'eyeSmall': eyeSmall
  };

}

// funzione che modifica il pesce attuando la transazione

function modifyFish(drawnFish, fish) {

  console.log('cambiato');

  let scale = (min, max, value) => d3.scaleLinear()
    .domain([0, 1])
    .range([min, max])(value);

  let x = scale(xMin, xMax, fish.x);
  let y = scale(yMin, yMax, fish.y);
  let bodyDim = scale(bodyDimMin, bodyDimMax, fish.bodyDim);
  let armDim = scale(armDimMin, armDimMax, fish.armDim);
  let eyeDim = scale(eyeDimMin, eyeDimMax, fish.eyeDim);

  let bodyHeight = bodyDim * 0.3;


  modifyTriangle(drawnFish.arm, x + bodyDim - armDim * 0.55,
    y + bodyHeight / 2,
    armDim);

  modifyEllipse(drawnFish.body,
    x,
    y,
    bodyDim,
    bodyHeight);

  modifyCircle(drawnFish.eyeBig, x + bodyDim / 5,
    y + bodyHeight / 2,
    eyeDim, '#fff');

  modifyCircle(drawnFish.eyeSmall,
    x + bodyDim / 5,
    y + bodyHeight / 2,
    eyeDim / 2, '#222');


}



var drawnFishes = [];



/*viene caricato il json*/

d3.json("/data/pesci.json").then(function (data) {
  data.forEach(function (fish) {


    let scale = (min, max, value) => d3.scaleLinear()
      .domain([min, max])
      .range([0, 1])(value);

    fish.x = scale(xMin, xMax, fish.x);
    fish.y = scale(yMin, yMax, fish.y);
    fish.bodyDim = scale(bodyDimMin, bodyDimMax, fish.bodyDim);
    fish.armDim = scale(armDimMin, armDimMax, fish.armDim);
    fish.eyeDim = scale(eyeDimMin, eyeDimMax, fish.eyeDim);


    fishes.push(fish);
  });
  fishes.forEach(function (fish) {
    drawnFishes.push(createFish(fish));
  });
});
console.log(fishes);

