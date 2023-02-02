import app from './app'
import * as dotenv from 'dotenv'

dotenv.config()

/**
 * Get port from environment and store in Express.
 */
const server = app.listen(process.env.PORT || 5000, () => {
  console.log("  App is running at http://localhost:%d in %s mode",
              process.env.PORT || 5000,
              app.get("env")
            );
});

export default server;
