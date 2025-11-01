import { zValidator } from '@hono/zod-validator';
import { type ClipboardResponse, HTTP_STATUS, updateClipboardRequestSchema } from '@repo/types';
import type { TypedResponse } from 'hono';
import { clipboardObjectToEntity } from '../factories/clipboard.factory';
import { registerService } from '../middlewares/register-services';
import { validateUserKey } from '../middlewares/validate-user';
import { clipboardService } from '../services/clipboard.service';
import { createRoute } from '../utils/route';

const routes = createRoute('clipboard')
  .use(registerService('clipboardService', clipboardService))
  .use(validateUserKey)
  .basePath('/clipboard')
  .get('/', async (c): Promise<TypedResponse<ClipboardResponse, HTTP_STATUS.OK>> => {
    const { clipboardService, userKey } = c.var;

    // find clipboard
    const clipboard = await clipboardService.findClipboard(userKey);

    const response = clipboardObjectToEntity(clipboard);
    return c.json(response, HTTP_STATUS.OK);
  })
  .post('/', zValidator('json', updateClipboardRequestSchema), async (c): Promise<Response> => {
    const { clipboardService, userKey } = c.var;

    // get body
    const { content } = c.req.valid('json');

    // update clipboard
    await clipboardService.updateClipboard(userKey, content);

    return c.newResponse(null, { status: HTTP_STATUS.CREATED });
  });
export default routes;
