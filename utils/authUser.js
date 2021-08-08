import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import Router from 'next/router'
import cookie from "js-cookie";
import { store } from 'react-notifications-component';


export const registerUser = async (user,setErrorMsg) => {
  try {
    const res = await axios.post(`${baseUrl}/api/signup`, { user});
    console.log(res)
    store.addNotification({
        message: `${res.data.message}`,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
      return "success"
    // setToken(res.data);
  } catch (error) {
    const errorMsg = catchErrors(error);
    store.addNotification({
      message: `${errorMsg}`,
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
    setErrorMsg(errorMsg);
  }
//   setLoading(false);
};




export const getName=async (activationToken,setName)=>{
  await axios.post(`${baseUrl}/api/signup/getname`,{activationToken:activationToken}).then((res)=>{
    console.log(res)
    setName(res.data.name)
    return res.data.name
  })
}



export const resendActivationLink=async (activationToken)=>{
  await axios.post(`${baseUrl}/api/signup/resend-activation-link`,{oldToken:activationToken}).then((res)=>{
    store.addNotification({
      message: `${res.data.message}`,
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  })
}


export const activateAccount=async(activationToken)=>{

  await axios.post(`${baseUrl}/api/signup/activate`,{token:activationToken}).then((res)=>{
    console.log(res)
    if(res.data.message==="expired-activated"){
      Router.push("/")
    }
    else if(res.data.message==="link expired"){
      store.addNotification({
        message: `Link expired please resend activation link`,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
    }
    else if(res.data.message==="activated"){
      store.addNotification({
        message: `Account activated sucessfully`,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
      setToken(res.data.token)
    }
  }).catch((err)=>{
    const errorMsg = catchErrors(err);
    store.addNotification({
      message: `${errorMsg}`,
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
  })
}

export const activateUser = async (activateToken,setErrorMsg) =>{
    try {
        const res = await axios.post(`${baseUrl}/api/signup/activate`, { token:activateToken});
        store.addNotification({
            message: `Account activated successfully`,
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 2000,
              onScreen: true
            }
          });
          setToken(res.data);
        
    } catch (error) {
        const errorMsg = catchErrors(error);
        store.addNotification({
          message: `${errorMsg}`,
          type: "info",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        setErrorMsg(errorMsg);
    }

}

export const loginUser = async (user, setErrorMsg,setIsModalVisible) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth`, { user });
   
    setToken(res.data);
    store.addNotification({
      message: `Login Successfull!!`,
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
    setIsModalVisible(false)

  } catch (error) {
    const errorMsg = catchErrors(error);
    store.addNotification({
      message: `${errorMsg}`,
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
    setErrorMsg(errorMsg);
  }
};

const setToken = token => {
  cookie.set("token", token);
  Router.push("/");
};

export const authCookieSet=token=>{
  cookie.set("token", token);
  Router.push("/");
}



export const redirectUser=(ctx,location)=>{
  if(ctx.req){
    ctx.res.writeHead(302,{Location:location})
    ctx.res.end()
  }
  else{
    Router.push(location)
  }
}

export const logoutUser=(email)=>{
  cookie.set("userEmail_actern",email)
  cookie.remove("token")
  Router.push("/signin")
  Router.reload()
}