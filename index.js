const display = document.getElementById("display"); // stores display from html
const calculator = document.getElementById("calculator"); // stores calculator from html

let current = "0"; // what the user will type
let overwrite = false; // false means user is still typing 

//once clicked the button will be targeted 
calculator.addEventListener("click", (event) =>{
    const button = event.target.closest("button");
    if (!button || !button.dataset.action) return; // if no data action assigned then it will return nothing

    const action = button.dataset.action; // reads data action assigned
    const value = button.dataset.value; // reads data value assigned 

// which function to run based on user input 
    switch (action){
        case "number":
            handleNumber(value);
            break;
        case "operator":
            handleOperator(value);
            break;
        case "decimal":
            handleDecimal();
            break;
        case "percent":
            handlePercent();
            break;
        case "clear":
            clearAll();
            break;
        case "equals":
            calculate();
            break;
        default:
            return;
    }

    updateDisplay(); //shows output of updated user input 
});

// display new number if new number button is clicked 
function handleNumber (value){
    if (overwrite || current === "0"){
        current = value;
        overwrite = false;
    } else{
        current += value;
    }
}

function handleOperator (operator){
    const lastChar = current.slice(-1); //gets last character typed
    if (current === "0" && operator !== "-") return; // can type negative numbers 
    if ("+-*/".includes(lastChar)){
        current = current.slice(0, -1)+ operator;  //if last character is an operator it will be replaced
    } else {
        current += operator;
    }
    overwrite = false;
}

function handleDecimal(){
    if (overwrite){
        current = "0.";  // start a decimal 
        overwrite = false;
        return;
    }
    const parts = current.split(/[-+*/]/); // splits user input with operators 
    const lastPart = parts[parts.length -1];
    if (lastPart.includes("."))return; //return nothing if number already has decimal 
    current +=lastPart ? "." : "0.";
}

function handlePercent(){
    const match = current.match(/(-?\d+(\.\d*)?)$/); // turns number into percentage 
    if (!match) return;
    const numberStr = match[0];
    const startIndex = match.index;
    const number= parseFloat (numberStr);
    const percentValue = number / 100;

    current = current.slice(0, startIndex)+ String(percentValue);
    overwrite = false;
}

//resets calculator input
function clearAll(){
    current = "0";
    overwrite = false;
}

// calculates 
function calculate(){
    try{
        const result = Function ('"use strict"; return(' + current +")")();
        if (!isFinite(result)){
            current ="Error cannot be calculated";
        } else {
            current = String(result);
        }
        overwrite = true;

        display.classList.add("flash");
        setTimeout (() => display.classList.remove("flash"), 200);
    } catch (e) {
        current = "Error";
        overwrite = true;

        display.classList.add("flash");
        setTimeout(() => display.classList.remove("flash"), 200);

    }
}

//updates input screen
function updateDisplay(){
    display.textContent = current;
}