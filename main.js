"use strict";

const userInput = {
    name: {
        alerted: false,
        regex: /^[a-zA-Z]+ [a-zA-Z]+$/,
        valid: false,
        description: ""
    },
    email: {
        alerted: false,
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        valid: false,
        description: ""
    },
    phone: {
        alerted: false,
        regex: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
        valid: false,
        description: ""
    },    
    plan: {
        planSelect: "Arcade",
        planType: "Monthly",
        prefixes: "/mo",
        arcade: {
            "Monthly": "$9",
            "Yearly": "$90"
        },
        advanced: {
            "Monthly": "$12",
            "Yearly": "$120"
        },
        pro: {
            "Monthly": "$15",
            "Yearly": "$150"
        }
    },
    addons: {
        onlineService: {
            title: "Online service",
            selected: false,
            "Monthly" : "$1",
            "Yearly" : "$10"
        },
        largerStorage: {
            title: "Larger storage",
            selected: false,
            "Monthly" : "$2",
            "Yearly" : "$20"
        },
        customizableProfile: {
            title: "Customizable profile",
            selected: false,
            "Monthly" : "$2",
            "Yearly" : "$20"
        }
    }
}


// step 1 function:
function checkPersonalInput () {
    userInput[this.name].description = this.value;
    console.log(userInput[this.name].description);
    if((!userInput[this.name].regex.test(this.value)) && !userInput[this.name].alerted) {
        const label = document.querySelector(`label[for="${this.name}"]`);
        let p = document.createElement('p');
        p.className = `alert ${this.name}`;
        p.innerHTML = `This field is required`;
        label.append(p);
        userInput[this.name].alerted = true;
        userInput[this.name].valid = false;
    } else if ((userInput[this.name].regex.test(this.value))){
        if (userInput[this.name].alerted) {
            const alert = document.querySelector(`p.alert.${this.name}`);
            alert.remove();
        }
        userInput[this.name].alerted = false;
        userInput[this.name].valid = true;
    }
}

// step 2 functions:
function planSwitchHandler () {
    function planSwitchUpdater () {
        const planType = userInput.plan.planType;
        const prefix = userInput.plan.prefixes;
        // Update plan subscription price:
        const planArcade = document.getElementById("arcade");
        const planAdvanced = document.getElementById("advanced");
        const planPro = document.getElementById("pro");
        planArcade.innerText = userInput.plan.arcade[planType] + prefix;
        planAdvanced.innerText = userInput.plan.advanced[planType] + prefix;
        planPro.innerText = userInput.plan.pro[planType] + prefix;

        // Update addon price:
        const priceOS = '+' + userInput.addons.onlineService[planType] + prefix;
        const priceLS = '+' + userInput.addons.largerStorage[planType] + prefix;
        const priceCP = '+' + userInput.addons.customizableProfile[planType] + prefix;

        const onlineService = document.getElementById("online-service-price");
        const largerStorage = document.getElementById("larger-storage-price");
        const customizableProfile = document.getElementById("customizable-profile-price");
        onlineService.innerText = priceOS;
        largerStorage.innerText = priceLS;
        customizableProfile.innerText = priceCP;

        const sumOnlineService = document.getElementById("sum-online-service");
        const sumLargerStorage = document.getElementById("sum-larger-storage");
        const sumCustomizableProfile = document.getElementById("sum-customizable-profile");
        sumOnlineService.innerText = priceOS;
        sumLargerStorage.innerText = priceLS;
        sumCustomizableProfile.innerText = priceCP;
    }

    if (planYearly.checked) {
        displayYearly.classList.add("switched");
        displayMonthly.classList.add("switched");
        userInput.plan.planType = "Yearly";
        userInput.plan.prefixes = "/yr";
        planSwitchUpdater();
        return;
    } else if(!planYearly.checked) {
        displayYearly.classList.remove("switched");
        displayMonthly.classList.remove("switched");
        userInput.plan.planType = "Monthly";
        userInput.plan.prefixes = "/mo";
        planSwitchUpdater();
        return;
    }
}

function planChangeHandler () {
    const selectedPlan = document.querySelector(".selected");
    selectedPlan.classList.remove("selected");
    this.classList.add("selected");
    userInput.plan.planSelect = this.value;
}

//step 3 function: 
function addonsSelectHandler () {
    userInput.addons[this.value].selected = this.checked;
}

//step 4 function: 
function summaryUpdater () {
    const planType = userInput.plan.planType;
    const planName = userInput.plan.planSelect.toLowerCase();
    const prefix = userInput.plan.prefixes;

    const planSum = document.querySelector(".plan-sum div");
    const planSumTitle = planSum.querySelector("h5");
    const planSumPrice = document.getElementById("plan-price-sum");

    const totalPrice = document.getElementById("subscription-type-sum");
    const totalPriceDisplay = document.getElementById("final-price-display");

    // Display plan price:
    const planPrice = userInput.plan[planName][planType];
    planSumTitle.innerText = userInput.plan.planSelect + ' (' + userInput.plan.planType + ")";
    planSumPrice.innerText = planPrice + prefix;

    // Display addons
    const finalAddons = document.querySelectorAll(".sum-addons-option");
    finalAddons.forEach(addon => {
        const attr = addon.getAttribute("data-addon");
        if(userInput.addons[attr].selected) {
            addon.classList.remove("hidden-display");
        } else if(!userInput.addons[attr].selected) {
            addon.classList.add("hidden-display");
        }
    })

    // Display total price:
    let total = 0;
    total += parseInt(planPrice.slice(1, planPrice.length));

    for( const addon in userInput.addons) {
        if(userInput.addons[addon].selected) {
            const addonPrice = userInput.addons[addon][planType]
            const price = parseInt(addonPrice.slice(1, addonPrice.length));
            total += price;
        }
    }

    totalPrice.innerText = "Total price (" + planType.slice(0, planType.length -2).toLowerCase() + ")";
    totalPriceDisplay.innerText = "$" + total + prefix;
}


// continue button function
function stepHandler () {
    function changeActive(current, next) {
            current.classList.remove("active");
            next.classList.add("active");
            return;
    }
    function stepTitleHandler (step) {
        const h1 = document.querySelector(".title");
        const p = document.querySelector(".title-description");
        if(step.classList.contains("first")) {
            h1.innerText = "Personal info";
            p.innerText = "Please provide your name, email address, and phone number.";
        }
    
        if(step.classList.contains("second")) {
            h1.innerText = "Select your plan";
            p.innerText = "You have the option of monthly or yearly billing.";
        }
    
        if(step.classList.contains("third")) {
            h1.innerText = "Pick add-ons";
            p.innerText = "Add-ons help enhance your gaming experience.";
        }
        if(step.classList.contains("fourth")) {
            h1.innerText = "Finishing up";
            p.innerText = "Double-check everything looks OK before confirming.";
        }
    }

    const currentActiveDisplay = document.querySelector(".active");
    let step = parseInt(currentActiveDisplay.id);
    const nextStepDisplay = document.getElementById(step+1);
    const previousStepDisplay = document.getElementById(step-1);

    const currentStep = document.getElementById(`step-${step}`);
    const previousStep = document.getElementById(`step-${step-1}`);
    const nextStep = document.getElementById(`step-${step+1}`);

    function stepTransition () {
        changeActive(currentActiveDisplay, nextStepDisplay);
        stepTitleHandler(nextStepDisplay);
        currentStep.classList.add("hidden");
        nextStep.classList.remove("hidden");
    }


    if(this.classList.contains("continue-btn")) {
        if(step==1) {
            let personalInputValid = 0;
            for(const inputType in userInput) {
                if (userInput[inputType].valid) {
                    console.log(userInput[inputType].valid);
                    personalInputValid++;
                }
            }
            if(personalInputValid===3) {
                stepTransition();
            }
            return;
        } else if(step==2) {
            console.log("2")
            stepTransition();
            return;
        } else if(step==3) {
            console.log("3")
            stepTransition();
            summaryUpdater();
            return;
        }
    } else if (this.classList.contains("plan-change-btn")){
        console.log("ok");
        const stepSecondDisplay = document.getElementById(2);
        changeActive(currentActiveDisplay, stepSecondDisplay);
        stepTitleHandler(stepSecondDisplay);
        currentStep.classList.add("hidden");
        stepSecond.classList.remove("hidden");
    } else if(step !== 1){
        changeActive(currentActiveDisplay, previousStepDisplay);
        stepTitleHandler(previousStep);
        currentStep.classList.add("hidden");
        previousStep.classList.remove("hidden");
        }
}

// return button function



// const wrapper = document.querySelector(".wrapper");
const inputForm = document.querySelector(".input-form")
const continueBtn = document.querySelector(".continue-btn");
const stepsBtn = document.querySelectorAll(".steps-btn");
const returnBtn = document.querySelector(".return-btn");
const changeBtn = document.querySelector(".plan-change-btn");

// step 1:
const stepFirst = inputForm.querySelector("form");
const inputPersonal = document.querySelectorAll(".personal-input");

// step 2:
const stepSecond = inputForm.querySelector(".plan-select");
const planOptionInput = document.querySelectorAll(".plan-option input");
const planYearly = document.getElementById("monthly-yearly");
const displayMonthly = document.querySelector(".monthly");
const displayYearly = document.querySelector(".yearly");

// step 3:
const addonsOptions = document.querySelectorAll(".addons-option input[type='checkbox']");

// step 4:
const stepFourth = inputForm.querySelector(".finishing-up");


const trueArg = true;
// Event listeners:
// navigation
continueBtn.addEventListener("click", stepHandler);
returnBtn.addEventListener("click", stepHandler);
changeBtn.addEventListener("click", stepHandler);

// step 1:
inputPersonal.forEach(eachInput => {
    eachInput.addEventListener("focusout", checkPersonalInput);
})

// step 2:
planOptionInput.forEach(plan => {
    plan.addEventListener("click", planChangeHandler);
})
planYearly.addEventListener("change", planSwitchHandler);

// step 3:
addonsOptions.forEach(button => {
        button.addEventListener("change", addonsSelectHandler);
})


