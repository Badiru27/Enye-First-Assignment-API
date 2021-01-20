const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/rates", function (req, res) {
  let base = req.query.base;
  let currency = req.query.currency;

  try {
    if (base && currency) {
      const fetchData = async () => {
        try {
          return await axios.get(
            `https://api.exchangeratesapi.io/latest?base=${base}`
          );
        } catch (error) {
          return res
            .status(500)
            .json({ error: "Server error try again later" });
        }
      };

      const dispalyData = async () => {
        const resdata = await fetchData();

        const { base, date, rates } = resdata.data;

        const queried = currency.split(",");

        const units = Object.assign(
          {},
          ...queried.map((value) => ({
            [value]: rates[value],
          }))
        );

        res.json({
          results: {
            base: base,
            date: date,
            rates: units,
          },
        });
      };

      dispalyData();
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Bad request" });
  }
});

app.get("*", (req, res, next) => {
  return res.status(404).json({ error: "requested route unavailable" });
});

// start the server
app.listen(port);
console.log(`Server started! At http://localhost: ${port}`);
