// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

const testUrl = 'http://cdn.teambigbox.com'

describe('Hello World', () => {
	it('responds with Hello World!', async () => {
		const request = new IncomingRequest(`${testUrl}/`);
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});
});

describe('Upload Image', () => {
	it('uploads an image', async () => {
		const images = ['images/test1.webp', 'images/test2.jpg', 'images/test3.png'];
		const formData = new FormData();
		images.forEach((image) => {
			formData.append('images', new File([new ArrayBuffer(10)], image));
		});
		const request = new IncomingRequest(`${testUrl}/upload/image`, {
			method: 'POST',
			body: formData,
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		const imageIds = await response.text();
		expect(imageIds.split(', ')).toSatisfy((imageIds: string[]) => {
			return imageIds.length === images.length
				&& imageIds.every((imageId) => imageId.length === 16);
		});
	});
});

describe('Get Image', () => {
	it('gets an image', async () => {
		const imageId = `test-image-${Math.random().toString(36).substring(7)}`;
		const image = new File([new ArrayBuffer(10)], 'images/test.jpg');
		// @ts-ignore
		await env.BUCKET.put(`images/${imageId}`, image);
		const request = new IncomingRequest(`${testUrl}/get/image/${imageId}`);
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.arrayBuffer()).toEqual(await image.arrayBuffer());
	});
});

describe('Upload Video', () => {
	it('uploads a video', async () => {
		const videos = ['videos/test1.webm', 'videos/test2.mp4', 'videos/test3.mov'];
		const formData = new FormData();
		videos.forEach((video) => {
			formData.append('videos', new File([new ArrayBuffer(10)], video));
		});
		const request = new IncomingRequest(`${testUrl}/upload/video`, {
			method: 'POST',
			body: formData,
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		const videoIds = await response.text();
		expect(videoIds.split(', ')).toSatisfy((videoIds: string[]) => {
			return videoIds.length === videos.length
				&& videoIds.every((videoId) => videoId.length === 16);
		});
	});
});

describe('Get Video', () => {
	it('gets a video', async () => {
		const videoId = `test-video-${Math.random().toString(36).substring(7)}`;
		const video = new File([new ArrayBuffer(10)], 'videos/test.mp4');
		// @ts-ignore
		await env.BUCKET.put(`videos/${videoId}`, video);
		const request = new IncomingRequest(`${testUrl}/get/video/${videoId}`);
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.arrayBuffer()).toEqual(await video.arrayBuffer());
	});
});
