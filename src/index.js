const express = require("express");
const config = require('../config.json')
const app = express();

const PORT = config.SERVER.PORT || 4094
app.use(express.json()); // for parsing application/json

// Base route handler 
app.use("/apis", require("./routes"));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
