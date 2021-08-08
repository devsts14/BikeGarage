import React,{useState} from 'react'
import useInput from "../../custom-hooks/use-input";
import { loginUser } from '../../utils/authUser';

const isPassword = (value) => value.trim().length > 6;
const isEmail = (value) => value.includes("@");
const LoginForm = ({setIsModalVisible}) => {
  const [errorMsg,setErrorMsg]=useState("")
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
    if (emailIsValid && passwordIsValid) {
      formIsValid = true;
    }
  
    const submitHandler = (event) => {
      event.preventDefault();
      if (!formIsValid) {
        return;
      }
      const user={
        email:emailValue,
        password:passwordValue
      }
      loginUser(user,setErrorMsg,setIsModalVisible)
      console.log("Submitted!");
      resetEmail();
      resetPassword();
    };
  
    const emailClasses = emailHasError ? "form-control invalid" : "form-control";
    const passwordClasses = passwordHasError
      ? "form-control invalid"
      : "form-control";
    return (
        <form onSubmit={submitHandler}>
        <div className="control-group">
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
            <p className="error-text">
              Please enter a valid email address.
            </p>
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
    )
}

export default LoginForm
