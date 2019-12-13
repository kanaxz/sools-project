class NotifyingService {
	constructor() {
	}

	connect(notifier){
		this.notifier = notifier;
	}

	display(notification) {
		this.notifier.display(notification);
	}
}

var instance = new NotifyingService();

module.exports = instance;