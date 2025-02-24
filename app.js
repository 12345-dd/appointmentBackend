const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const doctorRoutes = require("./src/routes/doctorRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");

app.use("/doctors",doctorRoutes);
app.use("/appointments",appointmentRoutes);

const PORT = 5000;

mongoose.connect("mongodb://127.0.0.1:27017/appointmentDb").then(()=>{
    console.log("Database is connected");
}).catch((err)=>{
    console.log("error",err);
})

app.listen(PORT,()=>{
    console.log(`Server is running on port - ${PORT}`);
})
