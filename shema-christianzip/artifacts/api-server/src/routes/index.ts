import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import adminAuthRouter from "./adminAuth";
import projectsRouter from "./projects";
import postsRouter from "./posts";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(adminAuthRouter);
router.use(projectsRouter);
router.use(postsRouter);
router.use(chatRouter);

export default router;
