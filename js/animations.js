function initAnimations() {

    const elements =
        document.querySelectorAll(".reveal");


    if (!elements.length) {
        return;
    }


    /*
        If the browser doesn't support
        IntersectionObserver, show everything.
    */

    if (!("IntersectionObserver" in window)) {

        elements.forEach((element) => {

            element.classList.add("in-view");

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "in-view"
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.05
            }
        );


    elements.forEach((element) => {

        observer.observe(element);

    });


    /*
        Safety fallback:
        if something prevents the observer
        from triggering, reveal everything
        after 2 seconds.
    */

    setTimeout(() => {

        elements.forEach((element) => {

            element.classList.add("in-view");

        });

    }, 2000);

}