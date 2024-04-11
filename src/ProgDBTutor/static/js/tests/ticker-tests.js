import { Ticker } from '../ticker.js';
describe("Ticker Class Tests", function() {
    let ticker;
    let mockSubscriber;

    beforeEach(function() {
        ticker = new Ticker();
        mockSubscriber = {
            tick: jasmine.createSpy("tick")
        };
    });

    it("should add a valid subscriber", function() {
        ticker.addSubscriber(mockSubscriber);
        expect(ticker.subscribers.length).toEqual(1);
    });

    it("should throw an error when adding an invalid subscriber", function() {
        expect(function() {
            ticker.addSubscriber({});
        }).toThrowError("Ticker: Instance (Object) does not have a tick method.");
    });

    describe("Ticker Start and Stop", function() {
        beforeEach(function() {
            jasmine.clock().install();
            ticker.addSubscriber(mockSubscriber);
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it("should call tick on subscribers at the defined interval", function() {
            ticker.start();
            jasmine.clock().tick(1000 / 24); // Advance time by 1/24th of a second
            expect(mockSubscriber.tick).toHaveBeenCalledTimes(1);
        });

        it("should stop calling tick on subscribers after stop is called", async function() {
            ticker.start();
            jasmine.clock().tick(1000 / 24); // Ensure tick is called at least once
            ticker.stop();
            mockSubscriber.tick.calls.reset(); // Reset the spy to zero calls

            jasmine.clock().tick(1000 / 24); // Attempt to advance time again
            expect(mockSubscriber.tick).not.toHaveBeenCalled();
        });
    });
});
