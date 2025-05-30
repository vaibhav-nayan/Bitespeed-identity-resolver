import express from "express";
import contactRoutes from "./routes/contact.routes";

const PORT = process.env.PORT || 3000;


const app = express();
app.use(express.json());

app.use(contactRoutes);
app.get("/", (req, res) => {
    res.send("Server Running!");
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

export default app;
