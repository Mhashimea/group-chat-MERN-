import jwtmiddleware from "../../middlewares/jwtmiddleware";
import AuthenticationService from "../auth/auth.service";
import RouterFactory from "./../../router";
import { UserService } from "./user.service";

const factory = new RouterFactory();
const service = new UserService();
const authService = new AuthenticationService();

/**
 * Create new user
 * @route POST /user/create
 */
factory.post("/user/create", [], jwtmiddleware, async (request: any) => {
  try {
    const data = await service.createUser(request.body);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
});

/**
 * List of the users
 * @route GET /user/list
 */
factory.get("/user/list", [], jwtmiddleware, async (request: any) => {
  const { _id }: any = await authService.getSession(request);
  const data = await service.listUsers(_id);

  return { success: true, data };
});

/**
 * List of the unasigned users of particular group
 * @route GET /user/unassigned
 */
factory.get("/user/unassigned", [], jwtmiddleware, async (request: any) => {
  const { group_id } = request.query;
  const data = await service.listUnassignedUsers(group_id);

  return { success: true, data };
});

export default factory.routes;
