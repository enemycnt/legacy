import app from "./app";
import env from "./config/env";

const port = env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
