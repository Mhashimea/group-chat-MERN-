import { Router } from "express";
import users from "./users/index";
import auth from "./auth";
import group from "./group";
import message from "./message";

const router = Router();

router.use(users);
router.use(auth);
router.use(group);
router.use(message);

export default { path: "/api", handler: router };
