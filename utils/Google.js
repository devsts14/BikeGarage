import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import  GoogleLoginComp from '../components/Auth/GoogleLogin'

const Google = ({ informParent = f => f }) => {
    const responseGoogle = response => {
        axios({
            method: 'POST',
            url: `/api/auth/google-login`,
            data: { idToken: response.tokenId }
        })
            .then(response => {
                informParent(response);
            })
            .catch(error => {
                console.log('GOOGLE SIGNIN ERROR', error.response);
            });
    };

    const responseGoogleFailure=response=>{
        console.log(response)
    }
    return (
        <div className="google">
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={responseGoogle}
                onFailure={responseGoogleFailure}
                render={renderProps => (
                    <GoogleLoginComp googleco={renderProps} />
                )}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default Google;
