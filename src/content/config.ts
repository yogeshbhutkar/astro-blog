import { defineCollection, z } from "astro:content";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

const postsCollection = defineCollection({
	loader: async () => {
		const res = await fetch(`${import.meta.env.PAYLOAD_BASE_URL}/api/posts`);
		const blogs = await res.json();

		return blogs.docs.map((doc: any) => {
			return {
			...doc,
			id: doc.id.toString(),
			};
		});
	},
	schema: () => z.object({
		id: z.string(),
		title: z.string(),
		slug: z.string(),
		coverImage: z.object({
			alt: z.string(),
			url: z.string().transform((url)=>`${import.meta.env.PAYLOAD_BASE_URL}${url}`),
			height: z.number(),
			width: z.number(),
		}).optional(),
		content: z.object({
            root: z.object({
                children: z.array(z.any()),
                direction: z.string().optional(),
                format: z.string().optional(),
                indent: z.number().optional(),
                type: z.string(),
                version: z.number(),
            }),
            namespace: z.string().optional(),
        }).or(z.any()),
		tags: z.array(z.object({
			id: z.string(),
			tag: z.string(),
		})).optional(),
		isFeatured: z.boolean().default(false),
		excerpt: z.string().optional(),
		author: z.object({
			email: z.string().email(),
			name: z.string().optional(),
			profileImage: z.object({
				alt: z.string(),
				url: z.string().transform((url)=>`${import.meta.env.PAYLOAD_BASE_URL}${url}`),
				height: z.number(),
				width: z.number(),
			}).optional(),
		}),
		publishedDate: z.string().transform((str) => new Date(str)),
		updatedAt: z.string().transform((str) => new Date(str)),
		createdAt: z.string().transform((str) => new Date(str)),
	}).transform((data) => ({
		...data,
		content: (convertLexicalToHTML({ data: data.content })),
		publishedDate: data.publishedDate
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
			}),
		updatedAt: data.updatedAt
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
			}),
		createdAt: data.createdAt
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
			}),
	})),
});

export const collections = {
	blogs: postsCollection,
};
