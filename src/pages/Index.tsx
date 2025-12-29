import { Helmet } from "react-helmet-async";
import App from "../App";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CoffeeFarm Market – Support Coffee Farmers with STX ☕🌱</title>
        <meta name="description" content="Buy premium coffee beans directly from farmers worldwide. Pay with STX on Stacks blockchain. Support sustainable farming with Bitcoin L2." />
        <meta name="keywords" content="coffee, farmers, STX, Stacks, Bitcoin, blockchain, marketplace, DeFi, Web3" />
        <meta property="og:title" content="CoffeeFarm Market – Direct STX Marketplace for Coffee Farmers" />
        <meta property="og:description" content="Buy premium coffee beans directly from farmers worldwide. Pay with STX on Stacks blockchain." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://coffeefarm.market" />
      </Helmet>
      <App />
    </>
  );
};

export default Index;
