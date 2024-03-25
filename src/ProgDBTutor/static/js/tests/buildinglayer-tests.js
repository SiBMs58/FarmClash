import { BuildingLayer } from '../BuildingLayer.js';
describe("BuildingLayer Tests", function() {
    let buildingLayer;
    beforeEach(function() {
        buildingLayer = new BuildingLayer(); // Assuming the class is named BuildingLayer
    });

    describe("getAssetDir function", function() {
        it("should extract the correct directory name from asset names", function() {
            expect(buildingLayer.getAssetDir("Fences.4.1")).toEqual("Fences");
            expect(buildingLayer.getAssetDir("House.png")).toEqual("House");
        });
    });

    describe("handleClick method", function() {
        beforeEach(function() {
            spyOn(buildingLayer, 'handleClick').and.callThrough();
        });

        it("should return false for clicks on empty tiles", function() {
            expect(buildingLayer.handleClick(100, 100)).toBeFalse(); // Assuming (100, 100) is an empty tile
        });

        it("should allow building selection for moving on valid building click", function() {
            // You'll need to set up a mock state where there's a known building at a specific position
            expect(buildingLayer.handleClick(x, y)).toBeTrue(); // Replace x, y with coordinates of a known building
            expect(buildingLayer.movingBuilding).toBeTrue();
        });
    });

    describe("Mouse movement handling", function() {
        // This set of tests would depend on how you manage mouse movements
        // and would likely involve spying on mousemove event handlers and
        // checking for the correct updates to the building positions.
    });

    // Additional tests could be written for other methods and functionalities,
    // such as building position validation, map state serialization, etc.
});
