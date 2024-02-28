import functions from "@google-cloud/functions-framework";
import pause from "./pause.js";
import unpause from "./unpause.js";

// Register an HTTP function with the Functions Framework that will be executed
// when you make an HTTP request to the deployed function's endpoint.
functions.http("pause", pause);
functions.http("unpause", unpause);
