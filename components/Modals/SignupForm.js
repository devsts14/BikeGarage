import React,{useState} from "react";
import useInput from "../../custom-hooks/use-input";
import {registerUser} from '../../utils/authUser'

const isNotEmpty = (value) => value.trim() !== "";
const isPassword = (value) => value.trim().length > 6;
const isEmail = (value) => value.includes("@");

const SignupForm = () => {
  const [errorMsg,setErrorMsg]=useState('')
  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstName,
  } = useInput(isNotEmpty);
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isEmail);
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(isPassword);

  let formIsValid = false;
  if (emailIsValid && passwordIsValid && firstNameIsValid) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }
    const user={
      name:firstNameValue,
      email:emailValue,
      password:passwordValue
    }
    registerUser(user,setErrorMsg)
    console.log("Submitted!");
    resetEmail();
    resetPassword();
    resetFirstName();
  };
  const firstNameClasses = firstNameHasError
    ? "form-control invalid"
    : "form-control";

  const emailClasses = emailHasError ? "form-control invalid" : "form-control";
  const passwordClasses = passwordHasError
    ? "form-control invalid"
    : "form-control";
  return (
    <form onSubmit={submitHandler}>
      <div className="control-group">
        <div className={firstNameClasses}>
          <label htmlFor="name">
            <input
              type="text"
              id="name"
              value={firstNameValue}
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
              placeholder="Full Name"
            />
            <i className="far fa-user"></i>
          </label>
          {firstNameHasError && (
            <p className="error-text">Please enter Full name.</p>
          )}
        </div>
        <div className={emailClasses}>
          <label htmlFor="email">
            <i className="far fa-envelope"></i>
            <input
              type="text"
              id="email"
              value={emailValue}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              placeholder="Email address"
            />
          </label>
          {emailHasError && (
            <p className="error-text">Please enter a valid email address.</p>
          )}
        </div>
        <div className={passwordClasses}>
          <label htmlFor="password">
            <i className="fas fa-key"></i>
            <input
              placeholder="Password"
              type="password"
              id="password"
              value={passwordValue}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />
          </label>
          {passwordHasError && (
            <p className="error-text">
              Password should be atleast 6 characters long.
            </p>
          )}
        </div>
        <div className="form-actions">
          <button disabled={!formIsValid}>Submit</button>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
