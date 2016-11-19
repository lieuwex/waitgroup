var Future = require('fibers/future')

class WaitGroup {
	constructor() {
		this._futs = []
	}

	add(fn) {
		const fut = new Future()
		this._futs.push(fut)
		fn(fut.resolver())
	}

	defer(fn) {
		const fut = Future.task(fn)
		this._futs.push(fut)
	}

	wait() {
		for (const fut of this._futs) {
			fut.wait()
		}
	}
}

module.exports = WaitGroup
