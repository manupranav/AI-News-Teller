import React, { useState, useEffect, createRef } from "react";

import {
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";

import classNames from "classnames";
import useStyles from "./styles.js";

const NewsCard = ({
  article: { description, publishedAt, source, title, url, urlToImage },
  activeArticle,
  i,
}) => {
  const classes = useStyles();
  const [elRefs, setElRefs] = useState([]);
  const scrollToRef = (ref) => window.scroll(0, ref.current.offsetTop - 50);

  useEffect(() => {
    window.scroll(0, 0);

    setElRefs((refs) =>
      Array(20)
        .fill()
        .map((_, j) => refs[j] || createRef())
    );
  }, []);

  useEffect(() => {
    if (i === activeArticle && elRefs[activeArticle]) {
      scrollToRef(elRefs[activeArticle]);
    }
  }, [i, activeArticle, elRefs]);

  return (
    <Card
      ref={elRefs[i]}
      className={activeArticle === i ? classes.activeCard : classes.card}
    >
      <CardActionArea href={url} target="_blank">
        <CardMedia
          className={classes.media}
          image={
            urlToImage ||
            "https://pixabay.com/illustrations/news-headlines-newsletter-636978/"
          }
        />
        <div className={classes.details}>
          <Typography varient="body2" color="textSecondary" component="h2">
            {new Date(publishedAt).toDateString()}
          </Typography>
          <Typography varient="body2" color="textSecondary" component="h2">
            {source.name}
          </Typography>
        </div>
        <Typography className={classes.title} gutterBottom varient="h5">
          {title}
        </Typography>
        <CardContent>
          <Typography varient="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary">
          Learn More
        </Button>
        <Typography varient="h5" color="textSecondary">
          {i + 1}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
