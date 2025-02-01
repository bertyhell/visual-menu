import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import { getImagesForText } from './get-images-for-text';

const fastify = Fastify({ logger: true });

interface ImageQuery {
	query: string;
}

fastify.get('/images-by-text', async (request: FastifyRequest<{ Querystring: ImageQuery }>, reply: FastifyReply) => {
	const { query } = request.query;

	if (!query) {
		return reply.status(400).send({ error: 'Missing query parameter' });
	}

	try {
		const images = await getImagesForText(query);
		return { images };
	} catch (error) {
		fastify.log.error(error);
		return reply.status(500).send({ error: 'Failed to fetch images' });
	}
});

// Start Server
const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`🚀 Server running on http://localhost:3000`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
