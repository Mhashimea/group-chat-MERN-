import jwtmiddleware from "../../middlewares/jwtmiddleware";
import RouterFactory from "../../router";
import AuthenticationService from "../auth/auth.service";
import MessageService from "./message.service";

const factory = new RouterFactory();
const authService = new AuthenticationService();
const service = new MessageService();

factory.post("/message/create", [], jwtmiddleware, async (request: any) => {
  const { _id }: any = await authService.getSession(request);
  return service.createMessage(request.body, _id);
});

/**
 * List of the messages of group
 */
factory.get("/message/list", [], jwtmiddleware, async (request: any) => {
  const { _id }: any = await authService.getSession(request);
  const messages = await service.list(request.query, _id);
  return { succes: true, data: messages };
});

export default factory.routes;
