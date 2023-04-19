import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import * as dotenv from "dotenv";

dotenv.config();

const options = {
  apis: [
    "./src/routes/userRoutes.js",
    "./src/models/User.js",
    "./src/routes/postRoutes.js",
    "./src/models/Post.js"
  ],
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Appetit API",
      version: "0.0.9",
      description: "API for Appetit, a food-based social network"
    }
  }
};

const swaggerSpecs = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
  app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
  app.get("/api/v1/docs/json", (req, res) => {
    res.setHeader({ "Content-Type": "application/json" });
    res.send(swaggerSpecs)
  });
  console.log(`Documentation is available at ${process.env.BACKEND_URL}/api/v1/docs`);
}

export default swaggerDocs;