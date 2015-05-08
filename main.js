var imgList = [].slice.call(document.querySelectorAll("img"));
var liList = [].slice.call(document.querySelectorAll("li"));
var timeOutList = [];
var h1 = document.querySelector("h1");
var h3 = document.querySelector("h3");
var h4 = document.querySelector("h4");
var scoreText = document.querySelectorAll("p")[0];
var timeLeftText = document.querySelectorAll("p")[1];
var score;
var penaltyPoints = 300;
var scorePoints = 100;
var goodMole = "http://i.imgur.com/Cc12gF7.png";
var badMole = "http://i.imgur.com/9a5Qscq.png";
// times entered here in seconds; converted later.
var timeLength = 20;
var respawnMinTime = 1;
var respawnMaxTime = 3;
var clearBadMinTime = 2;
var clearBadMaxTime = 6;
var BODY = document.querySelector("body");

function getRandomTime(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function setMoleHoleCheck(img) {
  if (img.classList.length === 0) {
    setMoleHole(img);
  }
}

function setMoleHole(img) {
  var randomNum = Math.random();
  if (randomNum > .2) {
    img.setAttribute("src", goodMole);
    img.classList.add("good");
  } else {
    img.setAttribute("src", badMole);
    img.classList.add("bad");
  }
}

function initialize() {
  h3.innerHTML = "--"
  h4.innerHTML = timeLength;
  imgList.forEach(function(img) {
    img.classList.add("hidden");
    img.onclick = function() {
      clickhandler(img);
    }
  })
}

function setRespawns(min, max) {
  var hiddenImageList = [].slice.call(document.querySelectorAll(".hidden"));
  hiddenImageList.forEach(function(img) {
    setIndividualRespawn(img, min, max);
  });
}

function setIndividualRespawn(img, min, max) {
  var spawnEvent = setTimeout(function() {
    img.classList.remove("hidden");
    setMoleHoleCheck(img);
/*    if (img.classList.contains("bad")) {
      setBadMoleAutoClear(img);
    }*/
    setBadMoleAutoClear(img);
    // exchange above line with commented out section above
    // if you want the good moles to remain on-screen until clicked.
    // will wind up with too many clear events on each square eventually
    // but I think the alternative is making a setTimeout event array
    // for each square...
    // probably OK as long as game time limit is kept low.
  }, getRandomTime(min, max));
  timeOutList.push(spawnEvent);
}

function setBadMoleAutoClear(img) {
  var clearEvent = setTimeout(function() {
    clearImg(img);
  }, getRandomTime(clearBadMinTime * 1000, clearBadMaxTime * 1000));
  timeOutList.push(clearEvent);
}

function clearImg(img) {
  img.className = "";
  img.classList.add("hidden");
  setIndividualRespawn(img, respawnMinTime * 1000, respawnMaxTime * 1000);
}

/*function swapCursor() {
  BODY.classList.remove("cursor-hammer");
  BODY.classList.add("cursor-pow");
  setTimeout(function() {
    BODY.classList.remove("cursor-pow");
    BODY.classList.add("cursor-hammer");
  }, 200)
}*/

function clickhandler(img) {
/*  swapCursor();*/
  if (img.classList.contains("good")) {
    score += scorePoints;
  } else if (img.classList.contains("bad")) {
    score -= penaltyPoints;
  }
  writeScore();
  clearImg(img);
}

function writeScore() {
  h3.innerHTML = score;
}

function Game() {
}

Game.prototype.newGame = function() {
  function timeLeft() {
    var delta = Date.now() - startTime;
    return Math.ceil((timeLength * 1000 - delta)/1000);
  }
  
  function writeTimeLeft() {
    h4.innerHTML = timeLeft();
  }
  
  function clearTimeouts() {
    timeOutList.forEach(function(event) {
      clearTimeout(event);
    })
    setTimeout(function() {
      timeOutList.forEach(function(event) {
        clearTimeout(event);
      })
    }, 25)
    setTimeout(function() {
      timeOutList.forEach(function(event) {
        clearTimeout(event);
      })
    }, 50)
  }
  
  function clearText(element) {
    element.innerHTML = "";
  }
  
  function gameOver() {
    clearTimeouts();
    BODY.classList.remove("cursor-hammer");
    initialize();
    scoreText.innerHTML = "&nbsp;";
    h3.innerHTML = "Game over!"
    timeLeftText.innerHTML = "Your score: " + score + " points!";
    h4.innerHTML = "&nbsp;";
  }
  
  initialize();
  BODY.classList.add("cursor-hammer");
  scoreText.innerHTML = "Score:";
  timeLeftText.innerHTML = "Time left:"
  setRespawns(500, 2000);
  startTime = Date.now();
  var runningTimer = setInterval(function() {
    writeTimeLeft();
    if (document.querySelector("h4").innerHTML === "0") {
      clearInterval(runningTimer);
      gameOver();
    }
  }, 1000);
}

document.querySelector("button").onclick = function() {
  var thisgame = new Game();
  score = 0;
  writeScore();
  thisgame.newGame();
};

var goodMoleIcon = '<img src="' + goodMole + '">';
var goodMoleText = "<p>+" + scorePoints + "</p>";
var badMoleIcon = '<img src="' + badMole + '">';
var badMoleText = "<p>-" + penaltyPoints + "</p>";
liList[0].innerHTML = goodMoleIcon + goodMoleText;
liList[1].innerHTML = badMoleIcon + badMoleText;
