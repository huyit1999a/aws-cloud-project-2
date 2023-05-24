import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get(
    "/filteredimage",
    async (req: Request, res: Response, next: NextFunction) => {
      // get URL
      try {
        let absolutePath: string = (await filterImageFromURL(
          req.query.image_url
        )) as string;
        return res.status(200).sendFile(absolutePath, function (err) {
          console.log("Download file successfully");
          // delete file
          if (!err) {
            deleteLocalFiles([absolutePath]);
            console.log("Delete file successfully");
          }
        });
      } catch (e) {
        return next(e);
      }
    }
  );

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
