/* global it, describe, done */

const expect = require('chai').expect
const Future = require('fibers/future')
const WaitGroup = require('../');

describe('WaitGroup', function () {
	it('should be able to defer', function (done) {
		Future.task(function () {
			let ready = false
			const group = new WaitGroup()

			group.defer(function () {
				const fut = new Future()
				setTimeout(function () {
					ready = true
					fut.return()
				}, 250)
				fut.wait()
			})

			group.wait()
			done(ready ? undefined : new Error('not waited on WaitGroup'))
		})
	})

	it('should throw errors', function (done) {
		Future.task(function () {
			const group = new WaitGroup()

			group.defer(function () {
				const fut = new Future()
				setTimeout(function () {
					fut.throw('kaas')
				}, 250)
				fut.wait()
			})

			try {
				group.wait()
			} catch (e) {
				done()
				return
			}

			done(new Error('expected error to be thrown'))
		})
	})

	it('should not leak errors', function (done) {
		Future.task(function () {
			const fut = Future.task(function () {
				new WaitGroup().defer(function () {
					const fut = new Future()

					setTimeout(function () {
						fut.throw('kaas')
					}, 250)

					fut.wait()
				})
			})

			try {
				fut.wait()
				done()
			} catch (e) {
				done(e)
			}
		})
	})
})
