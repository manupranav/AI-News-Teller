intent(
  "What does this app do?",
  "What can I do here?",
  "What's the purpose of this project ?",
  reply("This is a ai news reader project.")
);

const NEWS_API = "3a883136c3ae4ec182367adb8c0cd3f1";
let savedArticles = [];

//This intent search news by sources..
intent("Give me the news from $(source* (.*))", (p) => {
  let NEWS_API_URL = `https://newsapi.org/v2/top-headlines`;

  if (p.source.value) {
    p.source.value = p.source.value.toLowerCase().split(" ").join("-");
    NEWS_API_URL = `${NEWS_API_URL}?sources=${p.source.value}&apiKey=${NEWS_API}`;
  }

  api.request(
    NEWS_API_URL,
    {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      },
    },
    (error, response, body) => {
      const { articles } = JSON.parse(body);

      if (!articles.length) {
        p.play("Sorry, please try searching for news from a different source");
        return;
      }

      savedArticles = articles;

      p.play({ command: "newHeadlines", articles });
      p.play(`Here are the (latest|recent|fresh) ${p.source.value}`);

      p.play("Would you like me to read the headlines?");
      p.then(confirmation);
    }
  );
});

//search news by terms
intent("What's  up with $(term* (.*))", (p) => {
  let NEWS_API_URL = `https://newsapi.org/v2/everything`;

  if (p.term.value) {
    NEWS_API_URL = `${NEWS_API_URL}?q=${p.term.value}&apiKey=${NEWS_API}`;
  }

  api.request(
    NEWS_API_URL,
    {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      },
    },
    (error, response, body) => {
      const { articles } = JSON.parse(body);

      if (!articles.length) {
        p.play("Sorry, please try searching for something else.");
        return;
      }

      savedArticles = articles;

      p.play({ command: "newHeadlines", articles });
      p.play(`Here are the (latest|recent) ${p.term.value}`);

      p.play("Would you like me to read the headlines?");
      p.then(confirmation);
    }
  );
});

//search news by category

const CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];
const CATEGORIES_INTENT = `${CATEGORIES.map(
  (category) => `${category}~${category}`
).join("|")}`;

intent(
  `(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`,
  (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines`;

    if (p.C.value) {
      NEWS_API_URL = `${NEWS_API_URL}?country=in&category=${p.C.value}&apiKey=${NEWS_API}`;
    }

    api.request(
      NEWS_API_URL,
      {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
        },
      },
      (error, response, body) => {
        const { articles } = JSON.parse(body);

        if (!articles.length) {
          p.play("Sorry, please try searching for a different category.");
          return;
        }

        savedArticles = articles;
        p.play({ command: "newHeadlines", articles });

        if (p.C.value) {
          p.play(`Here are the (latest|recent) ${p.C.value}`);
        } else {
          p.play(`Here are the (latest|recent) News.`);
        }

        p.play("Would you like me to read the headlines?");
        p.then(confirmation);
      }
    );
  }
);

//search news by latest-news
intent("Show me the latest news.", (p) => {
  let NEWS_API_URL = `https://newsapi.org/v2/top-headlines`;

  NEWS_API_URL = `${NEWS_API_URL}?country=in&apiKey=${NEWS_API}`;

  api.request(
    NEWS_API_URL,
    {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      },
    },
    (error, response, body) => {
      const { articles } = JSON.parse(body);

      if (!articles.length) {
        p.play("Sorry, please try searching for something else.");
        return;
      }

      savedArticles = articles;

      p.play({ command: "newHeadlines", articles });
      p.play(`Here are the (latest|recent) news for you.`);

      p.play("Would you like me to read the headlines?");
      p.then(confirmation);
    }
  );
});

const confirmation = context(() => {
  intent("yes", async (p) => {
    for (let i = 0; i < savedArticles.length; i++) {
      p.play({ command: "highlights", article: savedArticles[i] });
      p.play(`${savedArticles[i].title}`);
    }
  });

  intent("no", (p) => {
    p.play("Sure, sounds good to me.");
  });
});

intent("open (the|) (article|) (number|) $(number* (.*))", (p) => {
  if (p.number.value) {
    p.play({
      command: "open",
      number: p.number.value,
      articles: savedArticles,
    });
  }
});

intent("(go|) back", (p) => {
  p.play("Sure, going back.");
  p.play({ command: "newHeadlines", articles: [] });
});
