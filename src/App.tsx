import React from "react";

const Chatbot = React.lazy(() => import("./components/chatbot/Chatbot"));
const Weather = React.lazy(() => import("./components/weather/Weather"));

const App = () => {
  return (
    <>
      <Weather />
      <Chatbot />
    </>
  );
};

export default App;
