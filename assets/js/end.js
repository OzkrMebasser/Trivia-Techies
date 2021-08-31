const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;


finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
   saveScoreBtn.disabled = !username.value;
   //si hay un valor no habilita
});


saveHighScore = (e) => {
    
    e.preventDefault();
    /* prevenimos el default del formulario  */
    const scoreBoard = {
        score: mostRecentScore,
        name: username.value
    };

    highScores.push(scoreBoard);
    highScores.sort( (a,b) => b.score - a.score); // si b es mayor que a, poner b antes que a
    highScores.splice(MAX_HIGH_SCORES); //solo mantendra los 5 scores mas altos

    localStorage.setItem("highScores", JSON.stringify(highScores));
   
    window.location.assign("index.html");

};