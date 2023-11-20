// data
let PlayerRegistrationData = {
    playerAnswers: [],
};

// game
let operations = ["+", "-", "*"];
const initiateButton = document.getElementById("initiate-button");
const challenge = document.getElementById("challenge");
const controlsContainer = document.querySelector(".controls-container");
const outcome = document.getElementById("outcome");
const submitButton = document.getElementById("submit-button");
const endButton = document.getElementById("end-button");
const checkAnswerButton = document.getElementById("check-answer");
const registerButton = document.getElementById("register-button");
const errorMessage = document.getElementById("error-message");
const showPercentageArea = document.getElementById("showpercentage");
const showChartsButton = document.getElementById("show-charts-button");
let answerValue;
let operationQuestion;

//Random Value Generator
const randomValue = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const PlayGame = () => {
    //Two random values between 1 and 9
    let [num1, num2] = [randomValue(1, 9), randomValue(1, 5)];
    //For getting random operator
    let randomOperator = operations[Math.floor(Math.random() * operations.length)];
    if (randomOperator == "-" && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    //Solve equation
    let solution = eval(`${num1}${randomOperator}${num2}`);
    //For placing the input at random position
    //(1 for num1, 2 for num2, 3 for operator, anything else(4) for solution)
    let randomVar = randomValue(1, 5);
    if (randomVar == 1) {
        answerValue = num1;
        challenge.innerHTML = `<input type="number" id="inputValue" placeholder="?"\> ${randomOperator} ${num2} = ${solution}`;
    } else if (randomVar == 2) {
        answerValue = num2;
        challenge.innerHTML = `${num1} ${randomOperator}<input type="number" id="inputValue" placeholder="?"\> = ${solution}`;
    } else if (randomVar == 3) {
        answerValue = randomOperator;
        operationQuestion = true;
        challenge.innerHTML = `${num1} <input type="text" id="inputValue" placeholder="?"\> ${num2} = ${solution}`;
    } else {
        answerValue = solution;
        challenge.innerHTML = `${num1} ${randomOperator} ${num2} = <input type="number" id="inputValue" placeholder="?"\>`;
    }
};

submitButton.addEventListener("click", () => {
    PlayGame();
});

//User Input Check
checkAnswerButton.addEventListener("click", () => {
    errorMessage.classList.add("hide");
    let userInput = document.getElementById("inputValue").value;
    CheckAnswer(userInput);
});

//Start Game
initiateButton.addEventListener("click", () => {
    operationQuestion = false;
    answerValue = "";
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hide");
    //Controls and buttons visibility
    controlsContainer.classList.add("hide");
    initiateButton.classList.add("hide");
    getCurrentPlayerData();
    PlayGame();
    showAllStats();
});

endButton.addEventListener("click", () => {
    findPercentageScoreAndEndGame();
    showAllStats();
});
//Stop Game
const stopGame = (resultText) => {
    outcome.innerHTML = resultText;
    initiateButton.innerText = "Next Question";
    controlsContainer.classList.remove("hide");
    initiateButton.classList.remove("hide");
};

// _________________________
function calculateAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    document.getElementById("age").value = age + ` years old`;
}

function getCurrentPlayerData() {
    // Retrieve the existing PlayerRegistrationData from localStorage
    let storedData = localStorage.getItem("PlayerRegistrationData");

    if (storedData) {
        PlayerRegistrationData = JSON.parse(storedData);

        const { firstName, lastName, dateOfBirth, gender, email } = PlayerRegistrationData;
        document.getElementById("fName").value = firstName;
        document.getElementById("lName").value = lastName;
        document.getElementById("dob").value = dateOfBirth;
        calculateAge(dateOfBirth);
        document.getElementById("gender").value = gender;
        document.getElementById("email").value = email;

        enableEndAndStartButtons(); // Enable the End and Start buttons
        disableFields();

        // Show the data in the console
        console.log(PlayerRegistrationData);
    }
}

function Register(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let storedData = localStorage.getItem("PlayerRegistrationData");
    console.log(storedData);
    if (!storedData) {
        let fName = document.getElementById("fName").value;
        let lName = document.getElementById("lName").value;
        let dob = document.getElementById("dob").value;
        let age = document.getElementById("age").value;
        let gender = document.getElementById("gender").value;
        let email = document.getElementById("email").value;

        // Validations
        if (fName.length < 4 || lName.length < 4) {
            alert("First and Last name must be at least 4 characters long.");
            return;
        }

        if (age < 8 || age > 12) {
            alert("Age must be between 8 and 12.");
            return;
        }

        if (!email.endsWith("@gmail.com")) {
            alert('Email must end with "@gmail.com".');
            return;
        }

        // Create an object for the player data
        let playerData = {
            firstName: fName,
            lastName: lName,
            dateOfBirth: dob,
            age: age,
            gender: gender,
            email: email,
        };

        // Spread the attributes from playerData to PlayerRegistrationData
        PlayerRegistrationData = { ...PlayerRegistrationData, ...playerData };

        localStorage.setItem("PlayerRegistrationData", JSON.stringify(PlayerRegistrationData));

        disableFields(); // Disable form fields and the Register button
        enableEndAndStartButtons(); // Enable the End and Start buttons

        // Show the data in the console
        console.log(PlayerRegistrationData);
    } else {
        // Retrieve the existing PlayerRegistrationData from localStorage
        PlayerRegistrationData = JSON.parse(storedData);
        enableEndAndStartButtons(); // Enable the End and Start buttons
    }
}

// Function to check and validate the player's answer
const CheckAnswer = (userInput) => {
    if (userInput) {
        // If the user guessed the correct answer
        if (userInput == answerValue) {
            stopGame(`Yippie!! <span>Correct</span> Answer`);
            // Append the validated content to the global storage entity
            let playerResponse = {
                equation: challenge.innerHTML,
                playerResponse: userInput,
                isCorrect: true,
            };
            PlayerRegistrationData.playerAnswers.push(playerResponse);
        } else if (operationQuestion && !operations.includes(userInput)) {
            errorMessage.classList.remove("hide");
            errorMessage.innerHTML = "Please enter a valid operator";
        } else {
            stopGame(`Opps!! <span>Wrong</span> Answer`);
            // Append the validated content to the global storage entity
            let playerResponse = {
                equation: challenge.innerHTML,
                playerResponse: userInput,
                isCorrect: false,
            };
            PlayerRegistrationData.playerAnswers.push(playerResponse);
        }
    } else {
        errorMessage.classList.remove("hide");
        errorMessage.innerHTML = "Input Cannot Be Empty";
    }

    // Save updated PlayerRegistrationData Object
    localStorage.setItem("PlayerRegistrationData", JSON.stringify(PlayerRegistrationData));

    showAllStats();

    // Show the data in the console
    console.log(PlayerRegistrationData);
};

// Function to find the percentage score and end the game
function findPercentageScoreAndEndGame() {
    const fNameElement = document.getElementById("fName");
    const lNameElement = document.getElementById("lName");

    // Calculate and display total number of questions, the number of correct answers, the percentage score, and the player’s name and current date in the 'showpercentage' statistic display area.
    const totalQuestions = PlayerRegistrationData.playerAnswers.length;

    if (totalQuestions > 0) {
        let correctAnswers = 0;
        for (const answer of PlayerRegistrationData.playerAnswers) {
            if (answer.isCorrect) {
                correctAnswers++;
            }
        }
        const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(2);

        const currentDate = new Date().toLocaleDateString("en-US");

        // Clear the showpercentage statistic display area before displaying all data in it
        showPercentageArea.innerHTML = "";

        // Display the statistics
        showPercentageArea.innerHTML += `
        Player's Name: ${fNameElement.value + " " + lNameElement.value} <br>
        Current Date: ${currentDate} <br>
        Total Number of Questions: ${totalQuestions} <br>
        Number of Correct Answers: ${correctAnswers} <br>
        Percentage Score: ${percentageScore ? percentageScore : 0}%
    `;

        showPercentageArea.classList.remove("hidden");

        // Create close button
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close Stats";
        closeButton.addEventListener("click", () => {
            // Hide or remove the charts
            // ...

            // Hide the showpercentageDisplay
            showPercentageArea.classList.add("hidden");
        });

        // Append the close button to the showpercentageDisplay
        showPercentageArea.appendChild(closeButton);

        // store and reset  data
        appendAndResetPlayerData();
    } else {
        // store and reset  data
        appendAndResetPlayerData(false);
        window.alert("No questions answered! Data not saved!");
    }

    // Clear the form inputs
    fNameElement.value = "";
    lNameElement.value = "";
    document.getElementById("dob").value = "";
    document.getElementById("age").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("email").value = "";

    // Enable the Register button and disable other buttons
    registerButton.disabled = false;
    submitButton.disabled = true;
    checkAnswerButton.disabled = true;
    endButton.disabled = true;
    initiateButton.disabled = true;

    // Disable the Play and Results area
    challenge.innerHTML = "";
    outcome.innerHTML = "";
    errorMessage.innerHTML = "";
}

function appendAndResetPlayerData(append = true) {
    if (append) {
        let showallplayersData = JSON.parse(localStorage.getItem("showallplayers")) || [];
        showallplayersData.push(PlayerRegistrationData);
        localStorage.setItem("showallplayers", JSON.stringify(showallplayersData));
    }

    // Reset PlayerRegistrationData
    localStorage.removeItem("PlayerRegistrationData");
    PlayerRegistrationData = { playerAnswers: [] };
}

function showAllStats() {
    const showallplayersDisplay = document.getElementById("showallplayers");
    showallplayersDisplay.innerHTML = ""; // Clear the display area

    let showallplayersData = JSON.parse(localStorage.getItem("showallplayers"));

    if (showallplayersData && showallplayersData.length > 0) {
    // Add the "All Statistics" header
    showallplayersDisplay.innerHTML = `<div class="all-statistics-header">All Statistics</div>`;

    showallplayersData.forEach((playerData) => {
        // Calculate and display total number of questions, the number of correct answers, the percentage score, and the player’s name and current date in the 'showpercentage' statistic display area.
        const totalQuestions = playerData.playerAnswers.length;
        let correctAnswers = 0;
        for (const answer of playerData.playerAnswers) {
            if (answer.isCorrect) {
                correctAnswers++;
            }
        }
        const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(2);

        showallplayersDisplay.innerHTML += `
        <div class="player-info">
            First Name: ${playerData.firstName}, 
            Last Name: ${playerData.lastName}, 
            Age: ${playerData.age} <br/>
            Questions and Answers: <br/>${playerData.playerAnswers
                .map(
                    (answer) =>
                        `<div class="${answer.isCorrect ? "correct" : "incorrect"}">
                            &nbsp&nbsp&nbsp&nbsp&nbspQuestion:\n${
                                answer.equation
                            }&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ANSWER: ${answer.playerResponse}
                        </div>`
                )
                .join("<br/>")}
            <br/>Percentage Score: ${percentageScore ? percentageScore : "No questions answered"}%<br/>
            ---------------------------------------------
        </div>`;
        });
    } else {
        showallplayersDisplay.innerHTML = "No statistics available yet.";
    }
}

// Call showCharts() once when the page loads
showCharts();

// Refresh showCharts() every 5 seconds
setInterval(showCharts, 5000);

showChartsButton.addEventListener("click", () => {
    // Call the function to show charts
    const showpercentageDisplay = document.getElementById("showcharts");
    showpercentageDisplay.classList.add("visible");
});

function showCharts() {
    const showpercentageDisplay = document.getElementById("showcharts");
    showpercentageDisplay.innerHTML = ""; // Clear the display area
    let showallplayersData = JSON.parse(localStorage.getItem("showallplayers"));

    if (showallplayersData && showallplayersData.length > 0) {
        const totalPlayers = showallplayersData.length;
        const genders = showallplayersData.map((player) => player.gender);
        const percentageScores = showallplayersData.map((player) => findPercentageScore(player.playerAnswers));

        const genderFrequencies = getFrequencies(genders);
        const percentageScoreFrequencies = getPercentageScoreFrequencies(percentageScores);

        const genderChart = createBarChart(genderFrequencies, totalPlayers, "Gender");
        const percentageScoreChart = createBarChart(percentageScoreFrequencies, totalPlayers, "Percentage Score");

        showpercentageDisplay.appendChild(genderChart);
        showpercentageDisplay.appendChild(percentageScoreChart);
    } else {
        // Display a message when no stats are available
        showpercentageDisplay.innerHTML = "No chart statistics available.";
    }

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close Charts";
    closeButton.addEventListener("click", () => {
        // Hide or remove the charts
        // ...

        // Hide the showpercentageDisplay
        showpercentageDisplay.classList.remove("visible");
    });

    // Append the close button to the showpercentageDisplay
    showpercentageDisplay.appendChild(closeButton);
}

function getFrequencies(array) {
    const frequencies = {};
    for (let item of array) {
        frequencies[item] = frequencies[item] ? frequencies[item] + 1 : 1;
    }
    return frequencies;
}

function getPercentageScoreFrequencies(scores) {
    const frequencyRanges = {
        "<50": 0,
        "50-59": 0,
        "60-69": 0,
        "70-79": 0,
        "80-89": 0,
        "90-99": 0,
        100: 0,
    };

    for (let score of scores) {
        if (score < 50) {
            frequencyRanges["<50"]++;
        } else if (score >= 50 && score < 60) {
            frequencyRanges["50-59"]++;
        } else if (score >= 60 && score < 70) {
            frequencyRanges["60-69"]++;
        } else if (score >= 70 && score < 80) {
            frequencyRanges["70-79"]++;
        } else if (score >= 80 && score < 90) {
            frequencyRanges["80-89"]++;
        } else if (score >= 90 && score < 100) {
            frequencyRanges["90-99"]++;
        } else {
            frequencyRanges["100"]++;
        }
    }

    return frequencyRanges;
}

function createBarChart(frequencies, totalPlayers, chartName) {
    const chart = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = chartName;
    chart.appendChild(title);

    for (let key in frequencies) {
        const percentage = ((frequencies[key] / totalPlayers) * 100).toFixed(1);
        const bar = document.createElement("div");
        const img = document.createElement("img");
        img.src = "assets/thin_bar.jpeg";
        img.width = percentage;
        bar.appendChild(img);
        const label = document.createElement("span");
        label.textContent = `${key}: ${percentage}%`;
        bar.appendChild(label);
        chart.appendChild(bar);
    }
    return chart;
}

function findPercentageScore(playerAnswers) {
    if (!playerAnswers || playerAnswers.length === 0) {
        return 0;
    }

    const totalQuestions = playerAnswers.length;
    let correctAnswers = 0;

    for (const answer of playerAnswers) {
        if (answer.isCorrect) {
            correctAnswers++;
        }
    }

    return ((correctAnswers / totalQuestions) * 100).toFixed(2);
}

// Function to disable form fields and buttons after registration
function disableFields() {
    document.getElementById("fName").disabled = true;
    document.getElementById("lName").disabled = true;
    document.getElementById("dob").disabled = true;
    document.getElementById("age").disabled = true;
    document.getElementById("gender").disabled = true;
    document.getElementById("email").disabled = true;
    registerButton.disabled = true;
}

// Function to enable End and Start buttons
function enableEndAndStartButtons() {
    endButton.disabled = false;
    submitButton.disabled = false;
    checkAnswerButton.disabled = false;
}
