const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyText = document.querySelector("[data-copyMsg]");
const copybtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheck = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>./?';

let password = "";
let passwordlength = 10;
let checkCount = 0;
handleSlider();
//set strength circle colour to grey
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerHTML = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min, max) {
    //0 se leke max-min tak number aajayiega
    //for rounding off the number we used the Math.floor
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInt(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInt(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInt(65, 91));
}

function generateSymbol() {
    const randNm = getRandomInt(0, symbols.length);
    return symbols.charAt(randNm);
}

function calcStrength() {
    let hasUpper = false;
    let haslower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) haslower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && haslower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
    }
    else if ((haslower || hasUpper) && (hasNum || hasSym) && passwordlength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }

}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyText.innerText = "copied";
    }
    catch (e) {
        copyText.innerText = "failed";
    }
    //to make copy waala span visible
    copyText.classList.add("active");

    setTimeout(() => {
        copyText.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    //fisher yates method
    for (let i = array.length-1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheck.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    //special condition
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheck.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
})

copybtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
})

generateBtn.addEventListener('click', () => {
    //NONE of the checked box is selected
    if (checkCount == 0) return;

    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }

    //let's start the journey to find the new password
    console.log("starting journey")
    //remove old password
    password = "";
    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numberCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if (symbolCheck.checked) {
    //     password += generateSymbol();
    // }

  

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numberCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolCheck.checked) {
        funcArr.push(generateSymbol);
    }
    
    //cumpolsory addition -> jo bhi checked box ticked hain
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log('complosry addition done')
    
    // remaining addition
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randomIdx = getRandomInt(0, funcArr.length);
        console.log("randomIdx"+ randomIdx);
        password += funcArr[randomIdx]();
    }
    console.log('remaining is  done')

    //we have to shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    calcStrength();
});