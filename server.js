var axios = require("axios").default;
const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Server is running\n");
});

// Define the loop function
const loopFunction = () => {
  var options = {
    method: "GET",
    url: "https://cvs-data-public.s3.us-east-1.amazonaws.com/last-availability.json",
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      Referer: "https://checkvisaslots.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const h1bDropboxArray = response.data.result["H-1B (Dropbox)"];

      h1bDropboxArray.forEach((item) => {
        const dateObject = new Date(item.createdon);
        const cdtOffset = -5 * 60;
        const cdtDate = new Date(dateObject.getTime() + cdtOffset * 60 * 1000);
        const now = new Date();
        const currentTime = now.toLocaleString('en-US', { timeZone: 'America/Chicago' });

        console.log(
          `[${currentTime}] Last H1b Dropbox Time: ${cdtDate.toLocaleString('en-US', { timeZone: 'America/Chicago' })}(${item.visa_location})  ==> Earliest Date: ${item.earliest_date}`
        );
      });
    })
    .catch(function (error) {
      console.error(error);
    });
};

// Set up the interval to run the loop function every 5 seconds
setInterval(loopFunction, 10000);

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
