import "../styles/global.scss";
import Layout from "../components/Layout/Layout";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
function MyApp({ Component, pageProps }) {
  return (
    <>
    <ReactNotification />
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};
  const protectedRoutes = ctx.pathname === "/shop";
  if (!token) {
    protectedRoutes && redirectUser(ctx, "/signin");
  } else {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    try {
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
      });
      const { user } = res.data;
      // if (user) !protectedRoutes && redirectUser(ctx, "/");
      pageProps.user = user;
      pageProps.token=token;
    } catch (error) {
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/signin");
    }
  }

  return { pageProps };
};

export default MyApp;
