import { getApp, getAuth } from 'firebase-cfworkers';

function generateRandomString(length: number): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

function isImage(file: File): boolean {
	const ext = file.name.split('.').pop() as string;
	return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
}

function isVideo(file: File): boolean {
	const ext = file.name.split('.').pop() as string;
	return ['mp4', 'webm', 'mov'].includes(ext);
}

async function verifyAuth(request: any): Promise<string> {
	const app = getApp();
	await app.initializeApp({
		type: 'service_account',
		project_id: 'aroundy-69661',
		private_key_id: '6c6243bf4359b033cc244750af276a55dfd86fb2',
		private_key:
			'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWK8634djKyf+t\nRBFzEZgWkl244QjrkdIVsK0wErA4rzkr/2Nuey0TI4b79hUYQ9AONh9VajttH/9c\nads7DL1RkWve9MQ3Ldl12aSyTefxjfTZh8eYKDw77wTEr4MyzKm9cyDu4Wf8eKKm\n6/mvIIFq4z+U2HFMK2IR7CeLz57LBpJBSn8q7OzngL6gTagEefN8hViHUMWH7GNr\n85Y247jWqE4x5GoQMoVgIjhO1wIrkMvQHes+jMGYspf2kz3t2iaUVDbfKp/CscPH\n9B1+QVD93xfdHYVIy+RmFpBKOtZAiJuJa74CFV4XsBxWO4cgDFJ8N82XBuId+B8a\ncpkDsqvXAgMBAAECggEARxD5Qq4H5F573xAXpDGh4FeIDulpLtXPus/J4ApLfDu0\ngmN3qHjp/5BJ4cCJxmf2GUkfQ5YBCxhTgWRE0UbMaU0SWMSqeU7W+lKSYnIUdWRv\n62CxO82aEx8gW22L4Oblqg4STwHvoeibvDzQOKrWFtQ6TFc33RkGLUFJ7AwkOmSj\n6HsRkfGiV+FlLMSg5X6xPUh7boG4Qq+I5JTQR43mcuyTh+ARCsIOoiA7PsccNB+H\nqEtc0uPiJ1nmjIC78SIJM5b1vrRoCIIoxLQrDfVKg/2pBy+nCIftkfPBbSK1VJBh\ncpjFoBB21MSTsXYbX8chxjhPJGlhQHLORtOu6WzWeQKBgQDtsCvQdSkfv6yylR9H\n9dUcCLv3nQ8cHtwD6PzG12u8bCBd9G/8uFkQgFi1Nzmh1mReYMFIvaVUD66qys72\n/YHdxQ1Yz3K1x4ZEUujmdqLEgX/zD6C0y9YfmkEkPXzEg/T+n1/oPTqixwqmv0mx\nrHSoS4uPn8R2omn+AoTSWvvd6QKBgQDmq9Gs3hflsbSFXTR3HftW7oHZbN16k5rC\nDb9uJkKwLUHlQF+D3venLH7C5v3+ywCycdDq0+lyPcMa5QN7TuXcyEhIMiZWqUyY\n9n7WKw4NtbGBo3ib9ZITh2Gp16Moq9KTTXtXwGRLdGSjIRLqQonVAzbXZ8+2Iwju\nphsQ5d9jvwKBgQDh5rENs3x9Vz+8juwnCWcc+NQlN1mYAWBcOwCbvzv+3ck5YstY\npqDHhSRKPw2AWfIUnOK2zr+mEC2S16QyrKfT7aeMw8UjLVnX7/C4sQJrvySrDyxP\nCPgeGw5Ucjf10fB0W2bco+zprkDaUC2rNtu84+flfhRMKHqSVzSDdMOymQKBgC6M\nU6aHttjSMHSNJ242LacQQEHI9zSqHpu0PIIU1HZK27ZQdDXfQ6iHkRjxliXZf02D\nLD6G/t/f2MRPnJFAjaAtBnETNatdRKjFbTj4vUBE/woDG+6U8qJgOnQUoMcvTTIO\ne6psl5CmbzyACxoczUWf/WwgdcjybvYBrQqO6LJvAoGARmveO9wphrebyEX3NF2o\ndJUHClKB9Wa7O171K3mb9iQLNpN2b0vz/W4h39zrhBA3XD9HXY5NBX49tsjIQ+mU\nFuGqh8EgR+fv4JmutPeOl4xM/X/mKlhNYO/Cfmdjxtev9VPvXc6siji3idLp1J3p\n8wJC8aRGdA7z2jvXMPaFsA8=\n-----END PRIVATE KEY-----\n',
		client_email: 'firebase-adminsdk-zx7k9@aroundy-69661.iam.gserviceaccount.com',
		client_id: '105469311028434978517',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url:
			'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zx7k9%40aroundy-69661.iam.gserviceaccount.com',
	});
	const auth = getAuth(app);
	const token = request.headers.get('Authorization')?.split('Bearer ')[1];
	if (!token) {
		return '';
	}
	const uid = await auth.getUidFromToken(token);
	if (!uid) {
		return '';
	}
	return uid;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		if (path === '/') {
			return new Response('Hello World!');
		}

		if (path === '/upload' && method === 'POST') {
			const uid = await verifyAuth(request);
			if (!uid) {
				return new Response('Unauthorized', { status: 401 });
			}
			const formData = await request.formData();
			const files = formData.getAll('files') as File[];
			const fileIds = await Promise.all(
				files.map((file) => {
					if (!isImage(file) && !isVideo(file)) {
						return '';
					}
					const fileId = generateRandomString(16);
					return env.BUCKET.put(`files/${fileId}`, file).then(() => fileId);
				}),
			);
			return new Response(JSON.stringify(fileIds));
		}

		if (path.startsWith('/get/')) {
			const fileId = path.split('/get/')[1];
			const file = await env.BUCKET.get(`files/${fileId}`);
			if (!file) {
				return new Response('Not found', { status: 404 });
			}
			const headers = new Headers();
			file.writeHttpMetadata(headers);
			headers.set('etag', file.httpEtag);
			return new Response(file.body, { headers });
		}

		// default route
		return new Response(
			JSON.stringify({
				msg: 'Unknown operation',
			}),
			{ status: 405 },
		);
	},
} satisfies ExportedHandler<Env>;
