require("dotenv").config();

const app=require('./src/app')
const connectDB = require("./src/config/db");


connectDB();

// app.get("/", (req, res) => {
//   res.send("DevOps Deployment Monitoring API is running...");
// });



// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Server Error" });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
