import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Quattrocento+Sans:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <script src="https://kit.fontawesome.com/1dda1b7598.js" crossOrigin="anonymous"></script>
        </Head>
        <body>
          <Main />
          <div id="loginModal" />
          <div id="modalBackground"/>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
