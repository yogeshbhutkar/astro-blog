import { config, fields, collection } from "@keystatic/core";

export default config({
	storage: {
		kind: "cloud",
	},
	cloud: {
		project: "yogesh-bhutkar/personal-blog",
	},
	collections: {
		posts: collection({
			label: "Blogs",
			slugField: "title",
			path: "src/content/blogs/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				coverImage: fields.url({
					label: "Cover Image URL",
					validation: { isRequired: true },
				}),
				tags: fields.array(fields.text({ label: "Tag" }), {
					label: "Tags",
				}),
				author: fields.text({
					label: "Author",
					defaultValue: "yogeshbhutkar",
				}),
				avatar: fields.url({
					label: "Avatar Image URL",
					defaultValue: "./images/yogesh-bhutkar.webp",
				}),
				featured: fields.checkbox({
					label: "Featured",
					defaultValue: false,
				}),
				excerpt: fields.text({
					label: "Excerpt",
					defaultValue: "",
				}),
				publishedDate: fields.datetime({
					label: "Published Date",
					defaultValue: new Date().toISOString().split("T")[0],
					validation: { isRequired: true },
				}),
				content: fields.mdx({ label: "Content" }),
			},
		}),
	},
});
