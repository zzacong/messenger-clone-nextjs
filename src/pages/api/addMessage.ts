import { type NextApiHandler } from 'next';

import { type Message, messageSchema } from '$types';
import { redis } from '$server/db/redis';
import { pusherServerClient } from '$server/common/pusher';
import { getServerAuthSession } from '$server/common/get-server-auth-session';

type Data = Message;
const handler: NextApiHandler<Data> = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) return res.status(401).end();

  const message = req.body;
  const newMessage = messageSchema.parse({ ...message, createdAt: Date.now() });

  // push to upstash redis
  await redis.hset('messages', { [message.id]: JSON.stringify(newMessage) });
  pusherServerClient.trigger('messages-channel', 'new-message', newMessage);

  res.status(201).json(newMessage);
};

export default handler;
