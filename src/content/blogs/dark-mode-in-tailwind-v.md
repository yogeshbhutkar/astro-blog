---
title: Effortless Dark Mode in Tailwind v4 (Without Spamming dark:)
author: yogeshbhutkar
avatar: ./images/yogesh-bhutkar.webp
tags: ["Tailwind", "Astro", "UI", "CSS"]
featured: false
publishedDate: 2025-09-15
coverImage: ./images/tailwind-css-banner.webp
---

There have been multiple occasions where I had to implement different themes for my websites, which used Tailwind. Often, I felt taken aback by the complexities involved. More than complexities, they were redundancies and verbosities I’d go on to implement throughout my codebase.

For example, have a look at the following code:

```html
<h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight">
    Writes upside-down
</h3>
```

A normal text takes a particular colour, followed by the text colour to be applied on dark mode, with a prefix of `dark:`. These work, but are verbose. Imagine spamming `dark:` prefixes throughout your codebase. I was able to build upon this approach and arrived at a more CSS-focused solution.

### Using Tailwind’s [Theme Variables](https://tailwindcss.com/docs/theme)

According to the official documentation, “_Theme variables are special CSS variables defined using the @theme directive that influence which utility classes exist in your project._”

In simple words, these are just CSS variables such as `--color-mint-500`, which can be accessed using text-mint-500. We can define various themes using these theme variables. To do so, paste the following code within your Global CSS.

```css
@theme {
    /* Base Colors */
    --color-background: #ffffff;
    --color-foreground: #050505;
    --color-muted: #0a0a0a;
}
@layer theme {
    .dark {
        /* Base Colors */
        --color-background: #050505;
        --color-foreground: #fafafa;
        --color-muted: #cacaca;
    }
}
```

And now, to toggle the themes, for simplicity, let’s use the presence of `.dark` CSS classes to load up the dark theme. To do so, paste the following code within your Global CSS.

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Now, the custom themes defined within @theme can be used as regular colours with Intellisense. For example, we can create a `div` with our custom colours as follows:

```html
<div className=”bg-background”>
    <p className=”text-foreground”>
        Themes are awesome 🚀
    </p>
</div>
```

The colours will now automatically toggle based on the theme. We can even build a custom theme switcher using this approach. Here’s an example using Astro, but this approach can be used literally anywhere.

```astro
---
import Moon from "@/icons/moon.astro";
import Sun from "@/icons/sun.astro";
---

<button
    id="theme-toggle"
    aria-label="Toggle theme"
>
    <Moon />
    <Sun />
</button>

<script is:inline data-astro-rerun>
    (function () {
        // Initialize theme on page load.
        const theme = (() => {
            const localStorageTheme = localStorage.getItem("theme") ?? "";

            // Check if user already has a theme preference.
            if (["light", "dark"].includes(localStorageTheme)) {
                return localStorageTheme;
            }

            // If no preference, check the system preference.
            if (
                window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                return "dark";
            }

            return "light";
        })();

        document.body.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    })();
</script>

<script>
    const handleToggleClick = () => {
        const isDark =
            document.body.classList.contains("dark") ||
            localStorage.getItem("theme") === "dark"
                ? "dark"
                : false;
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "light" : "dark");
    };

    const attachEventListener = () =>
        document
            .getElementById("theme-toggle")
            ?.addEventListener("click", handleToggleClick);

    attachEventListener();

    // For Astro View Transitions support
    document.addEventListener("astro:after-swap", attachEventListener);
</script>
```

We’re also no longer restricted to just two themes; with minimal refactoring, this can easily scale to additional themes.
