// =========================
// Variables
// =========================

let isSignup = false;

const authModal = document.getElementById("authModal");
const soilForm = document.getElementById("soilForm");
const analyzeBtn = document.getElementById("analyzeBtn");
const authReminder = document.getElementById("authReminder");
const logoutBtn = document.getElementById("logoutBtn");
const usernameDisplay = document.getElementById("usernameDisplay");
const profilePhotoDisplay = document.getElementById("profilePhotoDisplay");

// =========================
// Check Login
// =========================

window.onload = () => {

    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if(user){

        authModal.style.display = "none";
        soilForm.style.display = "grid";
        analyzeBtn.style.display = "block";
        logoutBtn.style.display = "inline-block";

        usernameDisplay.innerHTML = user.username;

        if(user.photo){
            profilePhotoDisplay.src = user.photo;
            profilePhotoDisplay.style.display = "block";
        }

    }else{

        authReminder.style.display = "block";

    }

}

// =========================
// Toggle Login/Signup
// =========================

function toggleAuthMode(){

    isSignup = !isSignup;

    document.getElementById("nameGroup").style.display =
    isSignup ? "block":"none";

    document.getElementById("emailGroup").style.display =
    isSignup ? "block":"none";

    document.getElementById("confirmPasswordGroup").style.display =
    isSignup ? "block":"none";

    document.getElementById("profilePhotoGroup").style.display =
    isSignup ? "block":"none";

    document.getElementById("actionButton").innerHTML =
    isSignup ? "Sign Up":"Login";

    document.getElementById("formTitle").innerHTML =
    isSignup ? "Create Account":"Welcome Back!";

    document.getElementById("formSubtitle").innerHTML =
    isSignup ?
    "Join our soil monitoring community."
    :
    "Please login to access your dashboard.";

    document.getElementById("toggleText").innerHTML =
    isSignup
    ?
    'Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>'
    :
    'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign Up</a>';

}

// =========================
// Login / Signup
// =========================

document.getElementById("actionButton").onclick = function(){

    if(isSignup){

        signup();

    }else{

        login();

    }

}

// =========================
// Signup
// =========================

function signup(){

    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;
    const confirm=document.getElementById("confirmPassword").value;

    if(password!==confirm){

        Swal.fire("Error","Passwords do not match","error");
        return;

    }

    let photo="";

    const file=document.getElementById("profilePhoto").files[0];

    if(file){

        const reader=new FileReader();

        reader.onload=function(){

            photo=reader.result;

            saveUser(name,email,username,password,photo);

        }

        reader.readAsDataURL(file);

    }else{

        saveUser(name,email,username,password,photo);

    }

}

function saveUser(name,email,username,password,photo){

    const user={
        name,
        email,
        username,
        password,
        photo
    };

    localStorage.setItem("user",JSON.stringify(user));

    Swal.fire(
        "Success",
        "Account Created Successfully",
        "success"
    );

    toggleAuthMode();

}

// =========================
// Login
// =========================

function login(){

    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    const user=JSON.parse(localStorage.getItem("user"));

    if(!user){

        Swal.fire("Error","Create an account first.","error");
        return;

    }

    if(username===user.username && password===user.password){

        localStorage.setItem("loggedUser",JSON.stringify(user));

        location.reload();

    }else{

        Swal.fire("Error","Invalid Username or Password","error");

    }

}

// =========================
// Logout
// =========================

logoutBtn.onclick=function(){

    localStorage.removeItem("loggedUser");

    location.reload();

}

// =========================
// Theme
// =========================

document.getElementById("themeToggleBtn").onclick=function(){

    if(document.body.style.background=="black"){

        document.body.style.background="#dbe7ec";
        document.body.style.color="black";

    }else{

        document.body.style.background="black";
        document.body.style.color="white";

    }

}

// =========================
// Soil Analysis
// =========================

analyzeBtn.onclick=function(){

    const moisture=Number(document.getElementById("moisture").value);
    const ph=Number(document.getElementById("ph").value);
    const temperature=Number(document.getElementById("temperature").value);
    const nitrogen=Number(document.getElementById("nitrogen").value);
    const phosphorus=Number(document.getElementById("phosphorus").value);
    const potassium=Number(document.getElementById("potassium").value);
    const organicMatter=Number(document.getElementById("organicMatter").value);

    let result="Healthy Soil";

    let recommendation=[];

    let fertilizer=[];

    let crops=[];

    if(moisture<20){

        recommendation.push("Increase irrigation.");

    }

    if(ph<6){

        recommendation.push("Apply agricultural lime.");

    }

    if(ph>7.5){

        recommendation.push("Use sulfur to reduce pH.");

    }

    if(nitrogen<200){

        fertilizer.push("Urea");

    }

    if(phosphorus<20){

        fertilizer.push("DAP");

    }

    if(potassium<300){

        fertilizer.push("MOP");

    }

    if(organicMatter<2){

        fertilizer.push("Organic Compost");

    }

    if(ph>=6 && ph<=7){

        crops.push("Rice");
        crops.push("Wheat");
        crops.push("Maize");

    }

    if(ph>7){

        crops.push("Cotton");
        crops.push("Barley");

    }

    if(ph<6){

        crops.push("Potato");
        crops.push("Tea");

    }

    if(recommendation.length>2){

        result="Poor Soil";

    }

    document.getElementById("resultsContainer").style.display="block";

    document.getElementById("result").innerHTML=result;

    document.getElementById("recommendations").innerHTML=
    recommendation.length?
    recommendation.join("<br>"):
    "No recommendations.";

    document.getElementById("fertilizerRecommendations").innerHTML=
    fertilizer.length?
    fertilizer.join("<br>"):
    "No fertilizer needed.";

    document.getElementById("crops").innerHTML=
    crops.join(", ");

}