function initNavigation() {

    const navToggle =
        document.getElementById(
            "nav-toggle"
        );


    const navTabs =
        document.getElementById(
            "nav-tabs"
        );


    if (!navToggle || !navTabs) {
        return;
    }


    /* Mobile menu */

    navToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                navTabs.classList.toggle(
                    "open"
                );


            navToggle.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );


    /* Close menu after click */

    navTabs
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    navTabs.classList.remove(
                        "open"
                    );


                    navToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });


    /* Active section */

    const navLinks =
        Array.from(
            navTabs.querySelectorAll("a")
        );


    const sections =
        navLinks
            .map((link) => {

                const target =
                    link.getAttribute(
                        "href"
                    );

                return document.querySelector(
                    target
                );

            })
            .filter(Boolean);


    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const id =
                            "#" +
                            entry.target.id;


                        navLinks.forEach(
                            (link) => {

                                link.classList.toggle(
                                    "active",
                                    link.getAttribute(
                                        "href"
                                    ) === id
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin:
                    "-40% 0px -50% 0px"
            }
        );


    sections.forEach(
        (section) => {

            observer.observe(section);

        }
    );

}