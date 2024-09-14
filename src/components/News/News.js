import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import NullImage from "../../components/Images/nullImage.png";
import Loading from "../Loading/Loading";
import NewsItem from "../NewsItem/NewsItem";
import { v4 as uuidv4 } from "uuid";
import { Col, Row } from "react-bootstrap";
import { header } from "../../config/config";
import { endpointPath } from "../../config/api";
import { Container, Header, card } from "./index";

function News(props) {
  const { newscategory, country } = props;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const capitaLize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const category = newscategory;
  const title = capitaLize(category);
  document.title = `${capitaLize(title)} - News`;

  const updatenews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(endpointPath(country, category));
      const parsedData = response.data;
      setArticles(parsedData.articles);
    } catch (error) {
      console.error("Error fetching news:", error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 403) {
        alert("Access forbidden. You might have reached your request limit or need a higher plan.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    updatenews();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Header>{header(capitaLize(category))}</Header>
          <Container>
            <Row>
              {articles.map((element) => {
                return (
                  <Col sm={12} md={6} lg={4} xl={3} style={card} key={uuidv4()}>
                    <NewsItem
                      title={element.title}
                      description={element.description}
                      published={element.publishedAt}
                      channel={element.source.name}
                      alt="News image"
                      publishedAt={element.publishedAt}
                      imageUrl={
                        element.image === null ? NullImage : element.image
                      }
                      urlNews={element.url}
                    />
                  </Col>
                );
              })}
            </Row>
          </Container>
        </>
      )}
    </>
  );
}

News.defaultProps = {
  country: "us",
  newscategory: "general",
};

News.propTypes = {
  country: PropTypes.string,
  newscategory: PropTypes.string,
};

export default News;
