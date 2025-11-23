const display = document.getElementById("display");
const calculator = document.getElementById("calculator");

let current = "0";
let overwrite = false;

calculator.addEventListener("click", (event) =>{
    const button = event.target.closest("button");
    if (!button || !button.dataset.action) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

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
        case "clear":
            clearAll();
            break;
        case "equals":
            calculate();
            break;
        default:
            return;
    }

    updateDisplay();
});

function handleNumber (value){
    if (overwrite || current === "0"){
        current = value;
        overwrite = false;
    } else{
        current += value;
    }
}

function handleOperator (op){
    const lastChar = current.slice(-1);
    if (current === "0" && op !== "-") return;
    if ("+-*/".includes(lastChar)){
        current = current.slice(0, -1)+ op;
    } else {
        current += op;
    }
    overwrite = false;
}

function handleDecimal(){
    if (overwrite){
        current = "0.";
        overwrite = false;
        return;
    }
    const parts = current.split(/[-+*/]/);
    const lastPart = parts[parts.length -1];
    if (lastPart.includes("."))return;
    current +=lastPart ? "." : "0.";
}


function clearAll(){
    current = "0";
    overwrite = false;
}

function calculate(){
    try{
        const result = Function ('"use strict"; return(' + current +")")();
        if (!isFinite(result)){
            current ="Error";
        } else {
            current = String(result);
        }
        overwrite = true;
    } catch (e) {
        current = "Error";
        overwrite = true;
    }
}

function updateDisplay(){
    display.textContent = current;
}