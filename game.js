var yellow = new Array();
var blue = new Array();
var green = new Array();
var purple = new Array();
var answers = []; // Array to store answers
let selectedItems = []; // Array to track selected items
let correct = 0;
let guesses = 4;

function shuffleGrid(){
    const board = document.querySelector('.board');
    const items = Array.from(board.children);
    const shuffled = items.sort(() => Math.random() - 0.5);
    
    board.innerHTML = '';
    shuffled.forEach(item => board.appendChild(item));
}

function startGame() {
    console.log("Start Game");

    const answerBoxes = document.querySelectorAll('.answer_box');
    answers = Array.from(answerBoxes).map(box => box.textContent.trim());
    // Iterate and remove each one
    answerBoxes.forEach((box) => {
        box.remove();
    });
    
    selectedItems = []; // Clear selected items


    const board = document.querySelector('.board');
    const items = Array.from(board.children);

    // Define the click handler as a named function
    function handleClick(event) {
        const item = event.currentTarget;
        const textElement = item.querySelector('p');

        if (item.style.backgroundColor === "gray") {
            // Deselect the item
            item.style.backgroundColor = "white";
            textElement.style.backgroundColor = "white";

            const index = selectedItems.indexOf(item);
            selectedItems.splice(index, 1);
        } else {
            if (selectedItems.length >= 4) {
                console.log("You can only select up to 4 items.");
                return;
            }
            // Select the item
            item.style.backgroundColor = "gray";
            textElement.style.backgroundColor = "gray";
            selectedItems.push(item);
        }

        console.log("Selected items:", selectedItems);
    }


    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const textElement = item.querySelector('p');

        if(item.style.backgroundColor === "yellow"){
            yellow.push(textElement.textContent);
        } else if(item.style.backgroundColor === "blue"){
            blue.push(textElement.textContent);
        } else if(item.style.backgroundColor === "green"){
            green.push(textElement.textContent);
        } else if(item.style.backgroundColor === "purple"){
            purple.push(textElement.textContent);
        }

        // Reset the background color of all items
        item.style.backgroundColor = "white";
        textElement.style.backgroundColor = "white";
        textElement.contentEditable = "false";
        textElement.style.color = "black";
        item.querySelector('p').contentEditable = "false";

        // Add the click handler to each item
        item.addEventListener("click", handleClick);

        item.removeEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", item.dataset.position);
            setTimeout(() => {
                item.style.visibility = "hidden"; // Hide temporarily
            }, 0);
        });

        item.removeEventListener("dragend", () => {
            item.style.visibility = "visible"; // Show after drop
        });

    }

    window.clickHandler = handleClick;
    
    const guesses = 4;
    const guessTracker = document.querySelector("#guessTracker");
    guessTracker.innerHTML = "";
    for(let i = 0; i < guesses; i++){
        const circle = document.createElement("div");
        circle.classList.add("circle");
        guessTracker.appendChild(circle);
    }

}



function decrementGuesses() {
    guesses = guesses - 1;
    const circles = document.querySelectorAll("#guessTracker .circle");
    for (let i = circles.length - 1; i >= 0; i--) {
        if (!circles[i].classList.contains("hidden")) {
            circles[i].classList.add("hidden"); // Hide the circle
            break; // Stop after hiding one circle
        }
    }
}

function deselectAll() {
    console.log("Deselect All");
    // Reset the background color of all items
    for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const textElement = item.querySelector('p');
        item.style.backgroundColor = "white";
        textElement.style.backgroundColor = "white";
    }

    // Clear the selectedItems array
    selectedItems = [];
}

function revealRemainingAnswers() {
    console.log("Revealing remaining answers...");
    const bottomContainer = document.querySelector("#bottom-container");

    if (!bottomContainer) {
        console.error("Bottom container not found!");
        return;
    }

    // Define the colors corresponding to the answers
    const colors = ["yellow", "blue", "green", "purple"];

    // Iterate through the answers array
    answers.forEach((answer, index) => {
        // Check if an answer box for this color already exists
        const existingBox = bottomContainer.querySelector(`.answer_box[style*="background-color: ${colors[index]}"]`);
        if (!existingBox) {
            // Create a new answer box if it doesn't exist
            const answerBox = document.createElement("div");
            answerBox.classList.add("answer_box");
            answerBox.style.backgroundColor = colors[index];
            answerBox.textContent = answer;

            bottomContainer.appendChild(answerBox);
        }
    });

    // Reveal all tiles' colors
    const gamePieces = document.querySelectorAll(".game_piece");
    gamePieces.forEach((piece) => {
        const textElement = piece.querySelector("p");
        const textContent = textElement.textContent;

        // Check which color the text belongs to and set the background color
        if (yellow.includes(textContent)) {
            piece.style.backgroundColor = "yellow";
            textElement.style.backgroundColor = "yellow";
        } else if (blue.includes(textContent)) {
            piece.style.backgroundColor = "blue";
            textElement.style.backgroundColor = "blue";
        } else if (green.includes(textContent)) {
            piece.style.backgroundColor = "green";
            textElement.style.backgroundColor = "green";
        } else if (purple.includes(textContent)) {
            piece.style.backgroundColor = "purple";
            textElement.style.backgroundColor = "purple";
        }
    });
}

function checkGameOutput(color){
    
    for(let i = 0; i < selectedItems.length; i++){
        const item = selectedItems[i];
        item.style.backgroundColor = color;
        item.querySelector('p').style.backgroundColor = color;
        item.removeEventListener("click", window.clickHandler);
    }
    selectedItems = [];   
}

function checkGame(){
    console.log("Check Game");
    const selectedText = Array.from(selectedItems).map(item => item.querySelector('p').textContent);
    
    console.log(selectedText);

    if(selectedText.length !== 4){
        alert("Please select 4 items to check.");
        return;
    }

    if(guesses == 0){
        alert("No guesses left!");
        revealRemainingAnswers();
        return;
    }

    if(selectedText.every(text => yellow.includes(text))){
        correct++;
        checkGameOutput("yellow");
        const answerBox = document.createElement("div");
        answerBox.classList.add("answer_box");
        answerBox.style.backgroundColor = "yellow";
        answerBox.style.backgroundColor = "yellow";
        answerBox.textContent = answers[0];
        const bottomContainer = document.querySelector("#bottom-container");
        if (bottomContainer) {
            bottomContainer.appendChild(answerBox);
            
        } else {
            console.error("Bottom container not found!");
        }
        return "yellow";
    }

    if(selectedText.every(text => blue.includes(text))){
        correct++;
        checkGameOutput("blue");
        const answerBox = document.createElement("div");
        answerBox.classList.add("answer_box");
        answerBox.style.backgroundColor = "blue";
        answerBox.textContent = answers[1];
        const bottomContainer = document.querySelector("#bottom-container");
        if (bottomContainer) {
            bottomContainer.appendChild(answerBox);
            
        } else {
            console.error("Bottom container not found!");
        }
        return "blue";
    }

    if(selectedText.every(text => green.includes(text))){
        correct++;
        checkGameOutput("green");
        const answerBox = document.createElement("div");
        answerBox.classList.add("answer_box");
        answerBox.style.backgroundColor = "green";
        answerBox.textContent = answers[2];
        const bottomContainer = document.querySelector("#bottom-container");
        if (bottomContainer) {
            bottomContainer.appendChild(answerBox);
            
        } else {
            console.error("Bottom container not found!");
        }
        return "green";
    }

    if(selectedText.every(text => purple.includes(text))){
        correct++;
        checkGameOutput("purple");
        const answerBox = document.createElement("div");
        answerBox.classList.add("answer_box");
        answerBox.style.backgroundColor = "purple";
        answerBox.textContent = answers[3];
        const bottomContainer = document.querySelector("#bottom-container");
        if (bottomContainer) {
            bottomContainer.appendChild(answerBox);
            
        } else {
            console.error("Bottom container not found!");
        }
        return "purple";
    }

    // If none of the colors match, decrement guesses and return "none"
    decrementGuesses();
    // Hinting logic: Check if the user is one away
    if (yellow.filter(item => selectedText.includes(item)).length === yellow.length - 1) {
        deselectAll();
        alert("You are one away!");
        return "one away";
    }
    if (blue.filter(item => selectedText.includes(item)).length === blue.length - 1) {
        deselectAll();
        alert("You are one away!");
        return "one away";
    }
    if (green.filter(item => selectedText.includes(item)).length === green.length - 1) {
        deselectAll();
        alert("You are one away!");
        return "one away";
    }
    if (purple.filter(item => selectedText.includes(item)).length === purple.length - 1) {
        deselectAll();
        alert("You are one away!");
        return "one away";
    }

    //default, deselect all when wrong
    deselectAll();
    return "none";
}

function initializeGame() {
    console.log("Initialize Game");
    const board = document.querySelector(".board");
    board.innerHTML = ""; // Clear the board
    
    // Access all the elements with the 'answer_box' class
    const answerBoxes = document.querySelectorAll('.answer_box');

    // Define an array of colors corresponding to each box
    const colors = ['yellow', 'blue', 'green', 'purple'];

    // Iterate through the answer boxes and apply the colors
    answerBoxes.forEach((box, index) => {
        // Assign background color based on the index
        if (index < colors.length) {
            box.style.backgroundColor = colors[index];
            box.setAttribute('contenteditable', 'true'); // Make it editable
            box.style.color = "black"; // Set text color to black
        }
    });

    const numPieces = 16;

    // Initialize pieces and assign positions
    for (let i = 1; i <= numPieces; i++) {
        const gamePiece = document.createElement("div");
        gamePiece.classList.add("game_piece");
        gamePiece.setAttribute("draggable", "true"); // Make it draggable
        gamePiece.setAttribute("data-position", i); // Track position

        const p = document.createElement("p");
        p.contentEditable = "true";
        p.textContent = i;

        // Assign colors
        if (i % 4 === 1) {
            gamePiece.style.backgroundColor = "yellow";
            p.style.backgroundColor = "yellow";
            
        } else if (i % 4 === 2) {
            gamePiece.style.backgroundColor = "blue";
            p.style.backgroundColor = "blue";
            
        } else if (i % 4 === 3) {
            gamePiece.style.backgroundColor = "green";
            p.style.backgroundColor = "green";
            
        } else if (i % 4 === 0) {
            gamePiece.style.backgroundColor = "purple";
            p.style.backgroundColor = "purple";
        }

        gamePiece.appendChild(p);

        // Drag and Drop event listeners
        gamePiece.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", gamePiece.dataset.position);
            setTimeout(() => {
                gamePiece.style.visibility = "hidden"; // Hide temporarily
            }, 0);
        });

        gamePiece.addEventListener("dragend", () => {
            gamePiece.style.visibility = "visible"; // Show after drop
        });

        board.appendChild(gamePiece);
    }

    // Board event listeners for dropping
    board.addEventListener("dragover", (event) => {
        event.preventDefault(); // Allow drop
    });

    board.addEventListener("drop", (event) => {
        event.preventDefault();
        const draggedPosition = event.dataTransfer.getData("text/plain");
        const draggedElement = board.querySelector(`[data-position='${draggedPosition}']`);
        const dropTarget = event.target.closest(".game_piece");

        // Ensure the drop target is valid
        if (dropTarget && dropTarget !== draggedElement) {
            const targetPosition = dropTarget.dataset.position;

            // Swap positions
            draggedElement.dataset.position = targetPosition;
            dropTarget.dataset.position = draggedPosition;

            // Reorder elements in the DOM based on updated positions
            const pieces = Array.from(board.children);
            pieces.sort((a, b) => a.dataset.position - b.dataset.position);
            pieces.forEach(piece => board.appendChild(piece));
        }
    });
}


function main(){
    document.addEventListener("DOMContentLoaded", () => 
        {
        initializeGame();
        console.log(yellow);
        console.log(blue);
        console.log(green);
        console.log(purple);
        
        });

}


main();

