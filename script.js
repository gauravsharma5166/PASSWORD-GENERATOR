const inputSlider=document.querySelector("[pass-lenSlider]");
const lengthDisplay=document.querySelector("[pass-lenNum]");

const passwordDisplay=document.querySelector("[data-passwd]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[copymsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[pass-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+=/{[}]|?/';

let password="";
let passswordLength=10;
let checkCount=0;
handleSlider();
// set circle color to grey
setIndicator("#ccc");


//sets passwd length
function handleSlider(){
    inputSlider.value=passswordLength;
    lengthDisplay.innerText=passswordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize= ( (passswordLength - min)*100/(max - min)) + "% 100%";
}

//ind color
function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow also
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
}

function getrndminteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNum(){
    return getrndminteger(0,9);
}

function generateLowerc(){
    return String.fromCharCode(getrndminteger(97,123));
}

function generateUpperc(){
    return String.fromCharCode(getrndminteger(65,91));
}

function generatesymbols(){
    const randnum=getrndminteger(0,symbols.length);
    return symbols.charAt(randnum);
}

function calcstrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passswordLength>=8){
        setIndicator("#0f0");
    } 
    else if (
        (hasUpper || hasLower) &&
        (hasNum || hasSym) &&
        passswordLength>=6
    ) {
        setIndicator("#ff0");
    } 
    else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='copied';
    }
    catch(e){
        copyMsg.innerText='failed';
    }
    copyMsg.classList.add("active");
    setTimeout( ()=>{copyMsg.classList.remove("active");},2000);
}

function shufflePass(array){

    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

}

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    })
    if(passswordLength<checkCount){
        passswordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passswordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount==0)
        return;

    if(passswordLength<checkCount){
        passswordLength=checkCount;
        handleSlider();
    }

    password="";

    let funArr=[];

    if(uppercaseCheck.checked){
        funArr.push(generateUpperc);
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowerc);
    }

    if(symbolsCheck.checked){
        funArr.push(generatesymbols);
    }

    if(numbersCheck.checked){
        funArr.push(generateRandomNum);
    }

    for(let i=0; i<funArr.length; i++){
        password+=funArr[i]();
    }

    for(let i=0;i<passswordLength-funArr.length;i++){
        let randIndex=getrndminteger(0,funArr.length);
        password+=funArr[randIndex]();

    }

    password=shufflePass(Array.from(password));

    passwordDisplay.value=password;

    calcstrength();


});
