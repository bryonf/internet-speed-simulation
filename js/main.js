var vue_vm = new Vue({
	el: '#main',
	data: {
		num_cols: 8,

		// Simulated size of the image in MB.
		img_size: 1,

		// Simulated image dimensions in pixels.
		img_height: 50,
		img_width: 50,

		// Each demo to display, using a defined speed in Mbps.
		demos: [
			{speed: 0.2,  current: 0, time: 0},
			{speed: 0.5,  current: 0, time: 0},
			{speed: 1,    current: 0, time: 0},
			{speed: 1.5,  current: 0, time: 0},
			{speed: 2,    current: 0, time: 0},
			{speed: 2.5,  current: 0, time: 0},
			{speed: 5,    current: 0, time: 0},
			{speed: 10,   current: 0, time: 0},
			{speed: 25,   current: 0, time: 0},
			{speed: 50,   current: 0, time: 0},
			{speed: 100,  current: 0, time: 0},
			{speed: 1000, current: 0, time: 0}
		],

		// Return value of setInterval() call.
		download_interval: null,

		// How many intervals to run in a second.
		intervals_per_second: 30,

		// Just to avoid magic numbers.
		ms_per_second: 1000
	},
	mounted: function() {
		this.img_width = this.$el.offsetWidth / this.demos.length;
	},
	methods: {
		addDownloadProgress: function() {
			this.demos.forEach((demo) => {
				if(demo.current == this.bytesToBits(this.img_size)) {
					return;
				}

				demo.current = Math.min(demo.current + (demo.speed / this.intervals_per_second), this.bytesToBits(this.img_size));
				demo.time += this.ms_per_second / this.intervals_per_second;
			});
		},
		allDemosFinished: function() {
			return this.demos.filter((demo) => {
				return demo.current < this.bytesToBits(this.img_size);
			}).length === 0;
		},
		bytesToBits: function(bytes) {
			return bytes * 8;
		},
		clampValue: function(value, event) {
			return Math.max(parseInt(event.target.min), Math.min(parseInt(event.target.max), value)) + '';
		},
		ensureNonZero: function(value, event) {
			let clamped = Math.max(parseFloat(value), 0);
			return (clamped === 0 ? 1 : clamped) + '';
		},
		getProgress: function(demo) {
			return demo.current / this.bytesToBits(this.img_size);
		},
		getProgressHeight: function(demo) {
			return this.getProgress(demo) * 100;
		},
		getSecondsElapsed: function(demo) {
			return (demo.time / this.ms_per_second).toFixed(2);
		},
		initAll: function() {
			// Revert the simulated download progress for each demo back to 0.
			this.demos.forEach(function(demo) {
				demo.current = 0;
				demo.time = 0;
			});
		},
		intervalHandler: function() {
			this.addDownloadProgress();
			if(this.allDemosFinished()) {
				this.stop();
			}
		},
		start: function() {
			// Begin the download speed simulation.
			this.initAll();
			this.download_interval = setInterval(() => {
				this.intervalHandler();
			}, this.ms_per_second / this.intervals_per_second);
		},
		stop: function() {
			clearInterval(this.download_interval);
			this.download_interval = null;
		},
		toggleRun: function() {
			if(this.download_interval === null) {
				this.start();
			} else {
				this.stop();
			}
		}
	}
});