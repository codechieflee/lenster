import { createCors, error, json, Router } from 'itty-router';

import createSpace from './handlers/createSpace';
import isLive from './handlers/isLive';
import type { Env } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router.all('*', preflight);
router.get('/', () => new Response('gm, to spaces service 👋'));
router.get('/isLive/:spaceId', ({ params }, env) =>
  isLive(params.spaceId, env)
);
router.post('/createSpace', createSpace);

const routerHandleStack = (request: Request, env: Env, ctx: ExecutionContext) =>
  router.handle(request, env, ctx).then(json);

const handleFetch = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => {
  try {
    return await routerHandleStack(request, env, ctx);
  } catch {
    return error(500);
  }
};

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) =>
    handleFetch(request, env, context).then(corsify)
};
