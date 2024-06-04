import { formatTime, getRiskChance, gaussianRandom, generateRandomProbabilities, spaceTo_ } from '../explore';
describe("Helper Functions", function() {

    describe("formatTime", function() {
        it("should format time correctly", function() {
            expect(formatTime(1440)).toEqual("1d 0h 0m");
            expect(formatTime(60)).toEqual("1h 0m");
            expect(formatTime(20)).toEqual("20m");
            expect(formatTime(0.5)).toEqual("30s");
        });
    });

    describe("getRiskChance", function() {
        it("should calculate risk chance correctly", function() {
            expect(getRiskChance(20)).toBeGreaterThan(0);
            expect(getRiskChance(60)).toBeGreaterThan(0);
            expect(getRiskChance(180)).toBeGreaterThan(0);
            expect(getRiskChance(720)).toBeGreaterThan(0);
            expect(getRiskChance(1440)).toBeGreaterThan(0);
        });
    });

    describe("gaussianRandom", function() {
        it("should return a number", function() {
            expect(typeof gaussianRandom()).toEqual('number');
        });
    });

    describe("generateRandomProbabilities", function() {
        it("should return an array of probabilities that sum to approximately 1", function() {
            const probabilities = generateRandomProbabilities();
            const sum = probabilities.reduce((a, b) => a + b, 0);
            expect(sum).toBeCloseTo(1, 1);
        });
    });

    describe("spaceTo_", function() {
        it("should replace all spaces in a string with underscores", function() {
            expect(spaceTo_("Hello World")).toEqual("Hello_World");
            expect(spaceTo_("Jasmine Test")).toEqual("Jasmine_Test");
        });
    });

});