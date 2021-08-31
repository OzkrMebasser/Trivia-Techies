const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text")); 
/* Cambiar HTMLcollection a un array */
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressFull = document.getElementsByClassName("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let quesitonCounter = 0;
let availableQuestions =[];
let questions = [];


// fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple")
fetch("https://opentdb.com/api.php?amount=10&category=18") 
.then(res => {
    return res.json(); 
  
})
.then( loadedQuestions => {
    
    questions = loadedQuestions.results.map( loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1; 
        //para obtener un índice aleatorio de la respuesta correcta y guardarlo en el objeto.
        answerChoices.splice(formattedQuestion.answer-1, 0, loadedQuestion.correct_answer);
    
        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });
       
        console.log(formattedQuestion);
      
        return formattedQuestion;
    });
    //questions = loadedQuestions;
    startGame();

}).catch( error => {
    console.error(error);
})



//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions =[...questions]; 

    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
    
};

getNewQuestion = () => {

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        //para guardar la puntuación final en "mostRecentScore". Lo utilizaremos en la página final. ojo al final!
        return window.location.assign("end.html");  //Me direcciona al final del juego
    };
    
    questionCounter ++;
    progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //Para actualizar la "progressbar"
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;


    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
   
    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
       
    });

    availableQuestions.splice(questionIndex, 1);
    /* eliminar la pregunta seleccionada de las preguntas disponibles */

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
       if(!acceptingAnswers) return;
        /*si aun no estamos preparados para obtener respuestas, ignorar el clic */
       acceptingAnswers = false;
       const selectedChoice = e.target;
       const selectedAnswer = selectedChoice.dataset["number"];

        let classToApply = "incorrect";
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = "correct";
        }; 
       /* const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect' */
        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        };
        
        selectedChoice.parentElement.classList.add(classToApply);
        //añade la clase al elemento padre del texto seleccionado
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            /*esto es para remover el color una vez que la opción es seleccionada.
            el setTimeout es necesario porque cuando la clase add & remove se aplica sin tiempo de espera,
            ambos no serán aplicados.  */
            getNewQuestion();
        }, 1000);
       
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

