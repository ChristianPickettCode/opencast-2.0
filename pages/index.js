import Head from "next/head";
import Dapp from "./Dapp";

export default function Home() {
  return (
    <div>
      <Head>
        <title>OpenCast</title>
        <meta
          name="description"
          content="Upload your podcast to the blockchain and permaweb ✌️"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Dapp />
      </main>

      <footer></footer>
    </div>
  );
}
