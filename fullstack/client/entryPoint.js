var work = async function() {
	var app = await import("./app")
	await app.start()
}
work()
/*
if (window.WebComponents.ready) {
    work();
} else
    window.addEventListener('WebComponentsReady', function() {
        work();
    });
/**/