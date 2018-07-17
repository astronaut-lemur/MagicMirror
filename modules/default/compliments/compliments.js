/* global Log, Module, moment */

/* Magic Mirror
 * Module: Compliments
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("compliments", {

	// Module config defaults.
	defaults: {
		compliments: {
			anytime: [
				"Hey there kid!",
				"Mr. Stark... I don't feel so good...",
				"You're doing great.",
				"We have a hulk.",
				"Activating instant kill.",
				"I am groot.",
				"Bowties are cool.",
				"You're not gonna make the world any better by shouting at it!",
				"Don't give up.",
				"There’s always something to look at if you open your eyes!",
				"Where's Francis?",
				"Mr. Smith, I need you!",
				"Jelly-bean?",
				"Just be your natural, horrid self.",
				"Don't. Even. Blink.",
				"Always take a banana to a party.",
				"Four or five moments, that's all it takes.",
				"Nobody ever died from love.",
				"That's slander.",
				"I'm a big fan.",
				"You're more fun than bubble wrap!",
				"<3",
				"'Stress, insomnia and regret.'",
				"No, your Nan's a cannibal!"
				
			],
			morning: [
				"Good morning, Nim!",
				"Have a great day!",
				"Enjoy your day!",
				"Be you today.",
				"How was your sleep?",
				"Today is going to be a good day, and here's why...",
				"Hope you had a good night's sleep!",
				":)",
				"<3",
				"Eat breakfast!",
				"Breakfast is the most important meal of the day.",
				"Suit up!",
				"Avengers eat breakfast.",
				"10/10",
				"Fiiiiiiiiine",
				"Dang",
				"Today will be great.",
				"I've got a good feeling about today."
			
			],
			afternoon: [
				"Hey dude!",
				"Today is going to be a good day!",
				"Have a good day!",
				"Have you had lunch yet?",
				"Make sure you eat!",
				"Isn't it always afternoon?",
				"<3"
			],
			evening: [
				"Damn, son!",
				"You hungry?",
				"How was your day?",
				"Rest is for the weary, sleep is for the dead.",
				"Go to bed already!",
				"Sleep is for the weak.",
				"You'll regret staying up late at 7AM tommorrow...",
				"<3",
				"It's past your bedtime.",
				"I hope today was a good one.",
				"Everything takes time.",
				"Homework?",
				"Letters from school?",
				"Was today good?",
				"Have a good night!"
			],
			day_sunny: [
				"Remember sunglasses!",
				"Agh! It burns!",
				"Don't forget suncream!",
				"<3"
			],
			day_cloudy: [
				"The weather is Scottish.",
				"It's... grey.",
				"It's average outside.",
				"<3"
			],
			snow: [
				"Look. Outside.",
				"Amazing weather alert!",
				"Dude, it's snowing!",
				"Get your snowboard!",
				"It's beginning to look a lot like Christmas!",
				"Today is going to be amazing.",
				"<3"
			],
			rain: [
				"It's raining.",
				"Might need an umbrella.",
				"Bring a jacket today.",
				"<3"
			],
			showers: [
				"A jacket might be a good idea.",
				"Might need an umbrella today."
			],
			fog: [
				"Good luck with seeing anything today!"
			],
			cloudy_windy: [
				"Might need to equip iron boots!"
			],
			
			
		},
		updateInterval: 30000,
		remoteFile: null,
		fadeSpeed: 4000,
		morningStartTime: 3,
		morningEndTime: 12,
		afternoonStartTime: 12,
		afternoonEndTime: 17
	},

	// Set currentweather from module
	currentWeatherType: "",

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.lastComplimentIndex = -1;

		var self = this;
		if (this.config.remoteFile != null) {
			this.complimentFile(function(response) {
				self.config.compliments = JSON.parse(response);
				self.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/* randomIndex(compliments)
	 * Generate a random index for a list of compliments.
	 *
	 * argument compliments Array<String> - Array with compliments.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * compliments.length);
		};

		var complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/* complimentArray()
	 * Retrieve an array of compliments for the time of the day.
	 *
	 * return compliments Array<String> - Array with compliments for the time of the day.
	 */
	complimentArray: function() {
		var hour = moment().hour();
		var compliments;

		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime && this.config.compliments.hasOwnProperty("morning")) {
			compliments = this.config.compliments.morning.slice(0);
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime && this.config.compliments.hasOwnProperty("afternoon")) {
			compliments = this.config.compliments.afternoon.slice(0);
		} else if(this.config.compliments.hasOwnProperty("evening")) {
			compliments = this.config.compliments.evening.slice(0);
		}

		if (typeof compliments === "undefined") {
			compliments = new Array();
		}

		if (this.currentWeatherType in this.config.compliments) {
			compliments.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
		}

		compliments.push.apply(compliments, this.config.compliments.anytime);

		return compliments;
	},

	/* complimentFile(callback)
	 * Retrieve a file from the local filesystem
	 */
	complimentFile: function(callback) {
		var xobj = new XMLHttpRequest(),
			isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			path = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

	/* complimentArray()
	 * Retrieve a random compliment.
	 *
	 * return compliment string - A compliment.
	 */
	randomCompliment: function() {
		var compliments = this.complimentArray();
		var index = this.randomIndex(compliments);

		return compliments[index];
	},

	// Override dom generator.
	getDom: function() {
		var complimentText = this.randomCompliment();

		var compliment = document.createTextNode(complimentText);
		var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright";
		wrapper.appendChild(compliment);

		return wrapper;
	},


	// From data currentweather set weather type
	setCurrentWeatherType: function(data) {
		var weatherIconTable = {
			"01d": "day_sunny",
			"02d": "day_cloudy",
			"03d": "cloudy",
			"04d": "cloudy_windy",
			"09d": "showers",
			"10d": "rain",
			"11d": "thunderstorm",
			"13d": "snow",
			"50d": "fog",
			"01n": "night_clear",
			"02n": "night_cloudy",
			"03n": "night_cloudy",
			"04n": "night_cloudy",
			"09n": "night_showers",
			"10n": "night_rain",
			"11n": "night_thunderstorm",
			"13n": "night_snow",
			"50n": "night_alt_cloudy_windy"
		};
		this.currentWeatherType = weatherIconTable[data.weather[0].icon];
	},


	// Override notification handler.
	notificationReceived: function(notification, payload, sender) {
		if (notification == "CURRENTWEATHER_DATA") {
			this.setCurrentWeatherType(payload.data);
		}
	},

});
