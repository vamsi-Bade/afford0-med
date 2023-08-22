const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
let TOKEN = "";
const url = "http://20.244.56.144/";

// This function is responsible for performing a POST Request and obtain a token and return it.
const getToken = async () => {
  try {
    const tokenEndpoint = `${url}/train/auth`;
    const tokenRequestBody = {
      companyName: "Zandro Central",
      clientID: "f109ca69-4e49-430c-b11f-33773cd2f042",
      ownerName: "Vamsi",
      ownerEmail: "vamsibade18@gmail.com",
      rollNo: "22",
      clientSecret: "wWAXjuufUoPJlNOF",
    };

    const response = await axios.post(tokenEndpoint, tokenRequestBody);
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
};

// This function is responsible for updating the token variable with new value by calling getToken() function every 10mins as the token expires
const updateToken = async () => {
  try {
    TOKEN = await getToken();
    console.log(TOKEN);
    setTimeout(updateToken, 10 * 60 * 1000);
  } catch (error) {
    console.error("Error updating token:", error);
    setTimeout(updateToken, 60 * 1000);
  }
};
updateToken();

app.get("/trains", async (req, res) => {
  const time = new Date();
  const nextTime = new Date(time.getTime + 12 * 60 * 60 * 1000);
  const hours = nextTime.getHours();
  const mins = nextTime.getMinutes();
  const secs = nextTime.getSeconds();
  const pars = {
    Hours: hours,
    Minutes: mins,
    Seconds: secs,
  };
  try {
    const headers = {
      Authorization: `Bearer ${TOKEN}`,
    };

    axios
      .get(url + "/train/trains", { headers })
      .then((response) => {
        const responseData = response.data;
        responseData.sort((a, b) => {
          if (a.price.sleeper !== b.price.sleeper) {
            return a.price.sleeper - b.price.sleeper;
          }

          if (a.seatsAvailable.sleeper !== b.seatsAvailable.sleeper) {
            return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
          }
          const departureTimeA =
            a.departureTime.Hours * 3600 +
            a.departureTime.Minutes * 60 +
            a.departureTime.Seconds;
          const departureTimeB =
            b.departureTime.Hours * 3600 +
            b.departureTime.Minutes * 60 +
            b.departureTime.Seconds;

          return departureTimeB - departureTimeA;
        });
        res.status(200).json(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
      });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching data",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`port started at ${PORT}`));
