var work = function() {
    return import ("./app")
        .then((app) => {
            return app.start();
        })
        /**/
}

if (window.WebComponents.ready) {
    work();
} else
    window.addEventListener('WebComponentsReady', function() {
        work();
    });