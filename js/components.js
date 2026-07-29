async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) {
        console.error(`Element #${id} does not exist in index.html`);
        return;
    }

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status} - ${file}`
            );
        }

        const html = await response.text();

        element.innerHTML = html;

        console.log(`✓ Loaded: ${file}`);

    } catch (error) {

        console.error(`✗ Failed: ${file}`, error);

    }
}


async function loadPage() {

    console.log("Starting Mercy Classroom...");


    // NAVBAR
    await loadComponent(
        "navbar",
        "components/navbar.html"
    );


    // HERO
    await loadComponent(
        "hero",
        "sections/hero.html"
    );


    // ABOUT
    await loadComponent(
        "about",
        "sections/about.html"
    );


    // RESOURCES
    await loadComponent(
        "resources",
        "sections/resources.html"
    );


    // BLOG
    await loadComponent(
        "blog",
        "sections/blog.html"
    );


    // GALLERY
    await loadComponent(
        "gallery",
        "sections/gallery.html"
    );


    // CONTACT
    await loadComponent(
        "contact",
        "sections/contact.html"
    );


    // FOOTER
    await loadComponent(
        "footer",
        "components/footer.html"
    );


    console.log("✓ All HTML sections loaded");


    // Start navigation
    if (typeof initNavigation === "function") {
        initNavigation();
    }


    // Start animations
    if (typeof initAnimations === "function") {
        initAnimations();
    }


    // Start contact form
    if (typeof initContactForm === "function") {
        initContactForm();
    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadPage
);



// REGISTER SERVICE WORKER

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(registration => {

                console.log(
                    "✓ Service Worker registered:",
                    registration.scope
                );

            })
            .catch(error => {

                console.error(
                    "✗ Service Worker registration failed:",
                    error
                );

            });

    });

}