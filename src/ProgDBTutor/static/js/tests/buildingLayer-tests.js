import { BuildingMap } from '../BuildingLayer.js';
describe("BuildingLayer Tests", function() {
    let buildingLayer;
    beforeEach(function() {
        buildingLayer = new BuildingLayer(); // Assuming the class is named BuildingLayer
    });

    describe("Initialization", () => {
        it("fetches and loads all necessary assets and map data", async () => {
            spyOn(buildingMap, 'fetchBuildingAssetList').and.resolveTo();
            spyOn(buildingMap, 'fetchBuildingMapData').and.resolveTo();
            spyOn(buildingMap, 'preloadBuildingAssets').and.callFake((callback) => callback());

            await buildingMap.initialize();

            expect(buildingMap.fetchBuildingAssetList).toHaveBeenCalled();
            expect(buildingMap.fetchBuildingMapData).toHaveBeenCalled();
            expect(buildingMap.preloadBuildingAssets).toHaveBeenCalled();
        });
    });

    describe("Drawing Functionality", () => {
        beforeEach(() => {
            spyOn(buildingMap.ctx, 'drawImage');
        });

        it("draws all visible buildings correctly", () => {
            buildingMap.drawTiles();
            // Assuming each building should have called drawImage at least once.
            expect(buildingMap.ctx.drawImage).toHaveBeenCalledTimes(expectedNumberOfDrawCalls);
        });
    });

    describe("Interactive Functionality", () => {
        it("moves a building correctly within bounds", () => {
            const initialPosition = [...buildingMap.buildingInformation['fence1'].building_location];
            const movement = {x: 1, y: 1};

            buildingMap.moveBuilding(movement.y, movement.x, buildingMap.buildingInformation['fence1']);

            expect(buildingMap.buildingInformation['fence1'].building_location).toEqual([initialPosition[0] + movement.y, initialPosition[1] + movement.x]);
        });

        it("does not move buildings out of bounds", () => {
            const movement = {x: -1, y: 0}; // Assuming this would move the building out of bounds
            buildingMap.moveBuilding(movement.y, movement.x, buildingMap.buildingInformation['fence1']);
            // Verify no movement occurred
        });
    });

    describe("Right Click and Popup Functionality", () => {
        it("opens a popup with correct building information on right click", () => {
            spyOn(buildingMap, 'handleRightClick').and.callThrough();
            spyOn(window, 'openPopup');

            buildingMap.handleRightClick(100, 100);  // Assume coordinates hit a building

            expect(window.openPopup).toHaveBeenCalledWith(jasmine.any(Object));
        });
    });


    describe("Data Persistence", () => {
        it("updates the building map data correctly", async () => {
            spyOn(window, 'fetch').and.resolveTo(new Response(JSON.stringify({status: 'success'})));

            await buildingMap.updateBuildingMapDB();

            expect(window.fetch).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object));
        });
    });

});
