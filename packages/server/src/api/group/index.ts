import jwtmiddleware from "../../middlewares/jwtmiddleware";
import AuthenticationService from "../auth/auth.service";
import RouterFactory from "./../../router";
import GroupService from "./group.service";

const factory = new RouterFactory();
const service = new GroupService();
const authService = new AuthenticationService();

/**
 * Create new group
 * @route POST /group/create
 */
factory.post("/group/create", [], jwtmiddleware, async (request: any) => {
  const { _id }: any = await authService.getSession(request);
  return service.create(request.body, _id);
});

/**
 * Add new memeber to group
 * @route POST /group/add-member
 */
factory.post("/group/add-member", [], jwtmiddleware, async (request: any) => {
  const { groupId, userIds } = request.body;
  const { _id }: any = await authService.getSession(request);
  const response = service.assignUsersToGroup(groupId, userIds, _id);

  return { success: true, data: response };
});

/**
 * List of the groups of logged in user
 * @route GET /group/list
 */
factory.get("/group/list", [], jwtmiddleware, async (request: any) => {
  const { _id }: any = await authService.getSession(request);
  const groups = await service.list(_id);
  return { success: true, data: groups };
});

/**
 * Get group details
 * @route GET /group/details
 */
factory.get("/group/details", [], jwtmiddleware, async (request: any) => {
  const { group_id } = request.query;
  const details = await service.getGroupDetails(group_id);
  return { success: true, data: details };
});

/**
 * List of the memebers of group
 * @route GET /group/members
 */
factory.get("/group/members", [], jwtmiddleware, async (request: any) => {
  const { groupId } = request.query;
  const members = await service.getGroupMembers(groupId);
  return { success: true, data: members };
});

/**
 * Left the group by user
 * @route POST /group/left
 */
factory.post("/group/left", [], jwtmiddleware, async (request: any) => {
  const { groupId } = request.body;
  const { _id }: any = await authService.getSession(request);
  return { success: true, data: await service.leftGroup(groupId, _id) };
});

export default factory.routes;
