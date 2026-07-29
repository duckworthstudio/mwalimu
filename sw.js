const CACHE_VERSION = "mercy-v1";

const STATIC_CACHE = `${CACHE_VERSION}-static`;
const HTML_CACHE = `${CACHE_VERSION}-html`;

const STATIC_FILES = [
    "./",
    "./index.html",

    // CSS
    "./css/base.css",
    "./css/navbar.css",
    "./css/hero.css",
    "./css/about.css",
    "./css/resources.css",
    "./css/blog.css",
    "./css/gallery.css",
    "./css/contact.css",
    "./css/footer.css",

    // JavaScript
    "./js/components.js",
    "./js/navigation.js",
    "./js/animations.js",
    "./js/contact.js",

    // Components
    "./components/navbar.html",
    "./components/footer.html",

    // Sections
    "./sections/hero.html",
    "./sections/about.html",
    "./sections/resources.html",
    "./sections/blog.html",
    "./sections/gallery.html",
    "./sections/contact.html"
];


// INSTALL
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(STATIC_CACHE)
            .then(cache => {

                return cache.addAll(STATIC_FILES);

            })

    );

    self.skipWaiting();

});


// ACTIVATE
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(cacheName => {

                            return (
                                cacheName.startsWith("mercy-") &&
                                cacheName !== STATIC_CACHE &&
                                cacheName !== HTML_CACHE
                            );

                        })
                        .map(cacheName => {

                            return caches.delete(cacheName);

                        })

                );

            })

    );

    self.clients.claim();

});


// FETCH
self.addEventListener("fetch", event => {

    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);


    // Don't cache external websites
    if (url.origin !== self.location.origin) {
        return;
    }


    // HTML / page navigation
    if (
        request.mode === "navigate" ||
        url.pathname.endsWith(".html")
    ) {

        event.respondWith(

            fetch(request)

                .then(response => {

                    if (response.ok) {

                        const copy =
                            response.clone();

                        caches.open(HTML_CACHE)
                            .then(cache => {

                                cache.put(
                                    request,
                                    copy
                                );

                            });

                    }

                    return response;

                })

                .catch(() => {

                    return caches.match(request)
                        .then(cached => {

                            return (
                                cached ||
                                caches.match(
                                    "./index.html"
                                )
                            );

                        });

                })

        );

        return;
    }


    // CSS, JS, images and other static files
    event.respondWith(

        caches.match(request)
            .then(cached => {

                if (cached) {

                    // Return cached version immediately.
                    // Refresh it in the background.

                    event.waitUntil(

                        fetch(request)
                            .then(response => {

                                if (response.ok) {

                                    return caches.open(
                                        STATIC_CACHE
                                    ).then(cache => {

                                        return cache.put(
                                            request,
                                            response
                                        );

                                    });

                                }

                            })
                            .catch(() => {
                                // Network unavailable.
                            })

                    );

                    return cached;

                }


                // Not cached yet → network
                return fetch(request)
                    .then(response => {

                        if (response.ok) {

                            const copy =
                                response.clone();

                            caches.open(STATIC_CACHE)
                                .then(cache => {

                                    cache.put(
                                        request,
                                        copy
                                    );

                                });

                        }

                        return response;

                    });

            })

    );

});