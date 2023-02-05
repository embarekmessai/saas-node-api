import app from './app'

/**
 * Get port from environment and store in Express.
 */
app.listen(process.env.PORT || 5000, () => {
  console.log("  App is running at http://localhost:%d in %s mode",
              process.env.PORT || 5000,
              app.get("env")
            );
});

/**
 *  Mangodb connectio
 */
// mongoose.set('strictQuery', false);

// main().then(() => console.log("DB Connection Successfull!"))
//       .catch((err: any) => console.log(err));

// async function main(){
//     await mongoose.connect(process.env.MONGO_URL)
            
// }

