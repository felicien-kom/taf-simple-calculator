/*
    On a 4 x 5 = 20 boutons.
    10 numbers : (1 2 3 4 5 6 7 8 9 0)
    5 operators : (+ - * / MOD)
    1 equals : (=) NB Here equals is not considerated an operator
    1 plus or minus, so the positivity of the number
    1 delete : one character after another in input but all if result
    1 clear : clear all the momry and reset everything to its origin value
*/

// Recuperation des elements depuis le DOM
var myScreen = document.getElementById("screen");
var myHistory = document.getElementById("history-value");
var myButtons = document.querySelectorAll(".key");
var numbers = document.querySelectorAll(".number");
var operators = document.querySelectorAll(".operation");
var btnClear = document.getElementById("clear");
var btnDelete = document.getElementById("delete");
var btnPlusOrMinus = document.getElementById("plusorminus");
var btnPoint = document.getElementById("point");

/* Boutons des Operations et du résultat ("Egal") */
var btnPlus = document.getElementById("plus");
var btnMinus = document.getElementById("minus");
var btnTimes = document.getElementById("times");
var btnDivide = document.getElementById("minus");
var btnModulo = document.getElementById("divide");
var btnEquals = document.getElementById("equals");

// Variables utiles
var nbA;// Nombre actuel
var nbTemp;// Nombre de conservation intermediaire
var actualOperation;// Operation actuellement enregistree

// Variables speciales
var restart;// Lié au bouton "Egal"
var originChain;// Lié aux operateurs 
var texteTemp;
var readOnlyState;
var lastButtonPressedType;

function resetToZero(){
    myScreen.innerHTML = '0';
    myHistory.innerHTML = "";
    nbA = 0.0;
    nbTemp = 0.0;
    actualOperation = '';
    restart = false;
    originChain = true;
    texteTemp = '';
    readOnlyState = false;
    lastButtonPressedType = '';
}

function disableCalco(){
    myScreen.innerHTML = '<span>Error ! Clear the calculator.</span>';
    myHistory.innerHTML = "";
    numbers.forEach(elt => {
        elt.disabled = true;
    });
    operators.forEach(elt => {
        elt.disabled = true;
    });
    btnPlusOrMinus.disabled = true;
    btnPoint.disabled = true;
    btnEquals.disabled = true;
    btnDelete.disabled = true;
    lastButtonPressedType = '';
}

function enableCalco(){
    numbers.forEach(elt => {
        elt.disabled = false;
    });
    operators.forEach(elt => {
        elt.disabled = false;
    });
    btnPlusOrMinus.disabled = false;
    btnPoint.disabled = false;
    btnEquals.disabled = false;
    btnDelete.disabled = false;
    lastButtonPressedType = '';
}

function showTest(msg){
    console.log(msg);
}

function showHistory(msg){
    myHistory.innerHTML = '' + msg;
}

function setLastButtonPressedType(vlr){
    lastButtonPressedType = vlr;
    console.log("Lastly : " + lastButtonPressedType);
}

function methodForNumbers(elt){
    // console.log(elt.innerHTML);
    if(!restart){
        if(readOnlyState){
            myScreen.innerHTML = elt.innerHTML;
            readOnlyState = false;
        }
        else{
            if(myScreen.innerHTML == '0'){
                myScreen.innerHTML = elt.innerHTML;
            }
            else if(myScreen.innerHTML == '-0'){
                if(elt.innerHTML != '0'){
                    myScreen.innerHTML = myScreen.innerHTML.slice(0, -1);
                    myScreen.innerHTML += elt.innerHTML;
                }
            }
            else{
                myScreen.innerHTML += elt.innerHTML;
            }
        }
    }
    else{
        myScreen.innerHTML = elt.innerHTML;
        restart = false;
        myHistory.innerHTML = '';
        // Des que l'on clique sur un bouton, on se prepare à entamer ou continuer une operation, donc ...
    }
    setLastButtonPressedType("point");
    console.log(restart + ' -- ' + readOnlyState);
}

function methodForOperators(elt){
    restart = false;// En dehors ou à l'interieur du if, ca devrait faire pareil (...)
    if(lastButtonPressedType != 'operation'){
        // if(myScreen.innerHTML == ''){
        // // Normalement myScreen doit toujours contenir au minimum '0'
        //    myScreen.innerHTML = '0';
        //}
        nbA = parseFloat(myScreen.innerHTML);
        if(originChain){
            nbTemp = nbA;
            texteTemp = '' + nbTemp + ' ';
            originChain = false;
            showTest(texteTemp + '' + elt.id);
        } else {
            nbTemp = executeOperation(nbTemp, nbA, actualOperation);
            if(isNaN(nbTemp)){ disableCalco(); return; };

            texteTemp += '' + actualOperation + ' ' + nbA + ' ';
            showTest(texteTemp + ' = ' + nbTemp);
        }
        actualOperation = elt.id;
        showHistory(nbTemp + ' ' + formatOperator(actualOperation));
        myScreen.innerHTML = '' + nbTemp;
        readOnlyState = true;
        // myScreen.innerHTML = '';// To work
        // console.log(restart + ' -- ' + readOnlyState);
        lastButtonPressedType = "operation";
    }
    else{
        actualOperation = elt.id;
        showHistory(nbTemp + ' ' + formatOperator(actualOperation));
    }
}

function executeOperation(a, b, op){
    if(op == 'plus'){ return a + b; }
    else if(op == 'minus'){ return a - b; }
    else if(op == 'times'){ return a * b; }
    else if(op == 'divide'){ if(b != 0){ return a / b; } else { return NaN; } }
    else if(op == 'modulo'){ if(b != 0){ return a % b; } else { return NaN; } }
    else{ return null; }
}

function formatOperator(op){
    if(op == 'plus'){ return '&plus;'; }
    else if(op == 'minus'){ return '&minus;'; }
    else if(op == 'times'){ return '&times;'; }
    else if(op == 'divide'){  return '&divide;'; }
    else if(op == 'modulo'){ return 'mod'; }
    else{ return null; }
}

function methodForPoint(){
    let temp = myScreen.innerHTML;
    if(!readOnlyState && temp.indexOf('.') == -1){
        console.log(temp.length);
        if(temp.length >= 2){
            myScreen.innerHTML = temp + '.';
        }
        else if(temp.length == 1){
            if(temp[0] == '-'){
                myScreen.innerHTML = temp + '0.';
            }
            else{
                myScreen.innerHTML = temp + '.';
            }
        }
        else{
            myScreen.innerHTML = temp + '0.';
        }
        setLastButtonPressedType("point");
    }
}

function methodForEquals(){
    if(actualOperation != ''){
        let tmp = nbTemp;
        nbA = parseFloat(myScreen.innerHTML);
        /*if(actualOperation == ''){
            nbTemp = nbA;
        }
        else{
            nbTemp = executeOperation(nbTemp, nbA, actualOperation);
            if(isNaN(nbTemp)){ disableCalco(); return; };
        //}*/

        nbTemp = executeOperation(nbTemp, nbA, actualOperation);
        if(isNaN(nbTemp)){ disableCalco(); return; };
        myScreen.innerHTML = nbTemp;
        restart = true;
        readOnlyState = false;
        originChain = true;
        showTest(texteTemp + '' + actualOperation + ' ' + nbA + ' = ' + nbTemp);
        showHistory(tmp + ' ' + formatOperator(actualOperation) + ' ' + nbA + ' =');
        texteTemp = '';
        actualOperation = '';
        setLastButtonPressedType("equals");
    }
}



// On execute resetToZero() pour commencer
resetToZero();



/* Evenements et traitements conséquents. */

/*
// Connaissance du type du dernier bouton (relativement important selon le cas) pressé
// Ceci doit être le premier eventListener excuté car executera une instruction importante
// pour la suite (prinicpalement les opérations)
myButtons.forEach(item => {
    item.addEventListener('click', ()=>{
        // console.log("Premier à etre execute !");
        if(item.classList.contains("operation")){
            setLastButtonPressedType("operation");
        }
    });
});
*/

// Saisie d'un nombre à l'écran
numbers.forEach(item => {
    item.addEventListener('click', ()=>{
        methodForNumbers(item);
    });
});

// Lorsqu'on clique sur "Clear", il s'agit de remettre absolument tout à zéro, à sa valeur intitiale
btnClear.addEventListener('click', ()=>{
    enableCalco();
    resetToZero();
    setLastButtonPressedType("clear");
});

btnDelete.addEventListener('click', ()=>{
    if(!readOnlyState){
        if(!restart){
            /*myScreen.innerHTML = '0';
            myHistory.innerHTML = '';
        } else {*/
            // console.log("OK !");
            if(myScreen.innerHTML.length == 1){
                myScreen.innerHTML = '0';
            }
            else{
                myScreen.innerHTML = myScreen.innerHTML.slice(0, -1);
            }
            setLastButtonPressedType("delete");
        }
    }
});

btnPlusOrMinus.addEventListener('click', ()=>{
    let temp = myScreen.innerHTML;
    if(!readOnlyState){
        if(temp.slice(0, 1) != '-'){
            myScreen.innerHTML = '-' + temp;
        }
        else{
            myScreen.innerHTML = temp.slice(1, temp.length);
        }
        setLastButtonPressedType("plusorminus");
    }
});

btnPoint.addEventListener('click', ()=>{
    methodForPoint();
});

operators.forEach(item => {
    item.addEventListener('click', ()=>{
        methodForOperators(item);
    });
});

btnEquals.addEventListener('click', ()=>{
    methodForEquals();
});