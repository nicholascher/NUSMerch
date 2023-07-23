function Validation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{12,}$/;

  if (values.email === "") {
    error.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email =
      "Email format is incorrect. Please enter a valid email address";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password =
      "Password format is incorrect. It should contain at least 12 characters, including uppercase, lowercase, numeric characters, and special characters";
  } else {
    error.password = "";
  }

  if (values.passwordAgain === "") {
    error.passwordAgain = "Password should not be empty";
  } else if (values.passwordAgain !== values.password) {
    error.passwordAgain = "Passwords do not match";
  } else {
    error.passwordAgain = "";
  }

  return error;
}

export default Validation;
