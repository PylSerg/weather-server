const express = require("express");
const path = require("path");
const Joi = require("joi");
const dotenv = require("dotenv");
const axios = require("axios").default;

dotenv.config({ path: path.resolve(__dirname, ".env") });

const PORT = process.env.PORT;

const app = express();

app.get("/weather", validateWeatherRequest, async (req, res, next) => {
  const response = await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lon=${req.query.lon}&lat=${req.query.lat}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    )
    .catch((error) => console.log(error.response));

  return res.status(200).send(response.data);
});

function validateWeatherRequest(req, res, next) {
  const schema = Joi.object({
    lon: Joi.number().min(-180).max(180).required(),
    lat: Joi.number().min(-90).max(90).required(),
  });

  const { error } = schema.validate(req.query);

  if (error) return res.status(400).send(error);

  next();
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
  console.log(`Open in browser: http://localhost:${PORT}/weather`);
});
