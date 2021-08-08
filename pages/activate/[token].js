import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  activateAccount,
  resendActivationLink,
  getName,
} from "../../utils/authUser";

const Activate = () => {
  const [name, setName] = useState("");
  const router = useRouter();
  console.log(router);
  const { token } = router.query;
  console.log(token);
  useEffect(() => {
      console.log(token)
    activateAccount(token);
    getName(token, setName);
  }, [token]);
  return (
    <div className="activate">
      <center className="activate__intro">{`Hey , ${name && name}`}</center>
      <span
        onClick={() => resendActivationLink(token)}
        className="activate__btn"
      >
        Resend Activation Link
      </span>
    </div>
  );
};

  // This gets called on every request

  
export default Activate;
