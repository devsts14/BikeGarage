import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import googleIcon from "@iconify/icons-flat-color-icons/google";
import styles from "./LoginModal.module.scss";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const ModalOverlay = (props) => {
  const [login, setLogin] = useState(true);
  return props.isModalVisible ? (
    <div className={styles.loginModal}>
      <i onClick={()=>props.setIsModalVisible(false)} className={`fas fa-times ${styles.close}`}></i>
      {login ? (
        <div className={styles.login}>
          <h1 className={styles.login__head}>LOGIN</h1>
          <LoginForm />
          <div className={styles.login__socialMedia}>
            <center>Or</center>
            <center style={{ margin: "2rem 0" }}>
              <div className={styles.login__socialMedia__google}>
                <Icon icon={googleIcon} width="30" height="30" />
                <span>Login with Google</span>
              </div>
            </center>
          </div>
          <hr />
          <p className={styles.login__switch}>
            Looking to create an account?
            <span style={{ cursor: "pointer" }} onClick={() => setLogin(false)}>
              {" "}
              Sign up
            </span>
          </p>
        </div>
      ) : (
        <div className={styles.login}>
          <h1 className={styles.login__head}>REGISTER</h1>
          <SignupForm />
          <div className={styles.login__socialMedia}>
            <center>Or</center>
            <center style={{ margin: "2rem 0" }}>
              <div className={styles.login__socialMedia__google}>
                <Icon icon={googleIcon} width="30" height="30" />
                <span>Login with Google</span>
              </div>
            </center>
          </div>
          <hr />
          <p className={styles.login__switch}>
            Already have an account?
            <span style={{ cursor: "pointer" }} onClick={() => setLogin(true)}>
              {" "}
              Login
            </span>
          </p>
        </div>
      )}
    </div>
  ) : null;
};

const ModalBackground = (props) => {
  return props.isModalVisible?<div onClick={()=>props.setIsModalVisible(false)} className={styles.modalBackground}></div>:null;
};
const LoginModal = (props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);
  return mounted ? (
    <React.Fragment>
      {createPortal(
        <ModalOverlay isModalVisible={props.isModalVisible} setIsModalVisible={props.setIsModalVisible} />,
        document.getElementById("loginModal")
      )}
      {createPortal(
        <ModalBackground isModalVisible={props.isModalVisible} setIsModalVisible={props.setIsModalVisible}/>,
        document.getElementById("modalBackground")
      )}
    </React.Fragment>
  ) : null;
};

export default LoginModal;
