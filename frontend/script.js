// ===============================
// SCRIPT.JS
// ===============================


// ===============================
// LOGIN FUNCTION
// ===============================

async function login() {

  const email =
    document.querySelector(
      'input[type="email"]'
    ).value;

  const password =
    document.getElementById(
      "password"
    ).value;

  if (!email || !password) {

    alert("Please fill all fields");

    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data =
      await response.json();

    if (data.success) {

      localStorage.setItem(
        "token",
        data.token
      );

      alert("Login Successful");

      window.location =
        "dashboard.html";

    } else {

      alert("Invalid Credentials");

    }

  } catch (error) {

    console.log(error);

    alert("Server Error");

  }

}


// ===============================
// SIGNUP FUNCTION
// ===============================

async function signup() {

  const email =
    document.getElementById(
      "signup-email"
    ).value;

  const password =
    document.getElementById(
      "signup-password"
    ).value;

  if (!email || !password) {

    alert("Please fill all fields");

    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/signup",
      {
        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data =
      await response.json();

    if (data.success) {

      alert(
        "Account Created Successfully"
      );

      window.location =
        "login.html";

    } else {

      alert(data.message);
    console.log(data);

    }

  } catch (error) {

    console.log(error);

    alert("Server Error");

  }

}


// ===============================
// PASSWORD TOGGLE
// ===============================

function togglePassword() {

  const password =
    document.getElementById(
      "password"
    );

  if (password.type === "password") {

    password.type = "text";

  } else {

    password.type = "password";

  }

}


// ===============================
// LOGOUT
// ===============================

function logout() {

  localStorage.removeItem("token");

  alert("Logged Out");

  window.location =
    "login.html";

}


// ===============================
// CHECK LOGIN
// ===============================

function checkLogin() {

  const token =
    localStorage.getItem("token");

  if (!token) {

    window.location =
      "login.html";

  }

}


// ===============================
// PAGE LOAD ANIMATION
// ===============================

window.addEventListener(
  "load",
  () => {

    document.body.style.opacity = 0;

    setTimeout(() => {

      document.body.style.transition =
        "0.8s";

      document.body.style.opacity = 1;

    }, 200);

  }
);


// ===============================
// BUTTON HOVER EFFECT
// ===============================

const buttons =
  document.querySelectorAll(
    "button"
  );

buttons.forEach((button) => {

  button.addEventListener(
    "mouseenter",
    () => {

      button.style.transform =
        "scale(1.03)";

    }
  );

  button.addEventListener(
    "mouseleave",
    () => {

      button.style.transform =
        "scale(1)";

    }
  );

});


// ===============================
// LIVE TIME GREETING
// ===============================

const hour =
  new Date().getHours();

if (hour < 12) {

  console.log("Good Morning");

}
else if (hour < 18) {

  console.log("Good Afternoon");

}
else {

  console.log("Good Evening");

}