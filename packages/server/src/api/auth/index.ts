import jwtmiddleware from "../../middlewares/jwtmiddleware";
import RouterFactory from "./../../router";
import AuthenticationService from "./auth.service";

const factory = new RouterFactory();
const service = new AuthenticationService();

/**
 * Login user
 * @route POST /auth/login
 */
factory.post("/auth/login", [], async (request: any) => {
  const data = await service.login(request.body);
  return { success: true, data };
});

/**
 * Register user
 * @route POST /auth/register
 */
factory.post("/auth/register", [], async (request: any) => {
  const data = await service.register(request.body);
  return { success: true, data };
});

/**
 * Session API
 * @route GET /session
 */
factory.get("/session", [], jwtmiddleware, async (request: any) => {
  const data = await service.getSession(request);
  return { success: true, data };
});

export default factory.routes;
