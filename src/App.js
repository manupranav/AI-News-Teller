import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";

import NewsCards from "./components/NewsCards/NewsCards";

const alanApi =
  "9eda9fc966295a5eb65f5d66d4fc56202e956eca572e1d8b807a3e2338fdd0dc/stage";

const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    alanBtn({
      key: alanApi,
      onCommand: ({ command, articles }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
        }
      },
    });
  }, []);

  return (
    <div>
      <h1>Alan ai news Reader</h1>
      <NewsCards articles={newsArticles} />
    </div>
  );
};

export default App;
