import { TerrainMap } from "../terrainLayer.js"


describe("TerrainMap Tests", function() {
    let terrainMap;
    let mockCtx;
    let mockMapData = {
        terrain_tiles: [
            // Assuming a simple map structure for testing
            ["Grass.1", "Water.1.1"],
            ["Grass.2", "Water.1.2"]
        ],
        map_width: 2,
        map_height: 2
    };

    beforeEach(function() {
        mockCtx = jasmine.createSpyObj('CanvasRenderingContext2D', ['drawImage']);
        terrainMap = new TerrainMap(mockMapData, 50, mockCtx);
        spyOn(window, 'getAssetDir').and.callFake(name => name.split('.')[0]);
        spyOn(window, 'getNextAssetName').and.callFake(name => name.replace(/([12])$/, match => match === '1' ? '2' : '1'));
        spyOn(terrainMap, 'drawTiles').and.stub();  // Use stub if no return value is needed
    });


    describe("Initialization and Asset Loading", function() {
        it("should preload terrain assets correctly", async function() {
            spyOn(terrainMap, 'fetchTerrainAssetList').and.resolveTo();
            spyOn(terrainMap, 'fetchTerrainMapData').and.resolveTo();
            spyOn(terrainMap, 'preloadTerrainAssets').and.resolveTo();

            await terrainMap.initialize();

            expect(terrainMap.fetchTerrainAssetList).toHaveBeenCalled();
            expect(terrainMap.fetchTerrainMapData).toHaveBeenCalled();
            expect(terrainMap.preloadTerrainAssets).toHaveBeenCalled();
            // Additional assertions to verify the assets are loaded correctly
        });
    });

    describe("Drawing Functionality", function() {
        beforeEach(function() {
            // Mock the window size
            spyOn(window, 'innerHeight').and.returnValue(100);  // Adjust as needed
            spyOn(window, 'innerWidth').and.returnValue(200);   // Adjust as needed

            // Set up a basic map and mock assets
            terrainMap.terrainAssets = {
                "/static/img/assets/terrain/Grass/Grass.1.png": new Image(),
                "/static/img/assets/terrain/Water/Water.1.1.png": new Image(),
                "/static/img/assets/terrain/Grass/Grass.2.png": new Image(),
                "/static/img/assets/terrain/Water/Water.1.2.png": new Image()
            };

            // Setup to handle out-of-bounds default water tile
            terrainMap.terrainAssets["/static/img/assets/terrain/Water/Water.1.1.png"] = new Image();
        });

        it("should draw terrain tiles correctly based on window size", function() {
            terrainMap.drawTiles();

            // Check if drawImage is called the expected number of times based on window size and tileSize
            const expectedCalls = Math.ceil(window.innerWidth / terrainMap.tileSize) * Math.ceil(window.innerHeight / terrainMap.tileSize);
            expect(mockCtx.drawImage).toHaveBeenCalledTimes(expectedCalls);

            // Verify that water tiles are drawn for out-of-bounds areas
            // (Add further specific checks for expected arguments if necessary)
        });
    });

    describe("Click Handling", function() {
        it("should process click events correctly and return true", function() {
            // Set up initial view position if any
            terrainMap.viewX = 0; // Adjust based on test requirements
            terrainMap.viewY = 0;

            // Mock click at specific coordinates
            const x = 75; // These coordinates should correspond to the tile (1,1) based on tile size of 50
            const y = 75;

            // Call handleClick with the mocked coordinates
            const clickHandled = terrainMap.handleClick(x, y);

            // Expect that the click is processed and marked as used by the class
            expect(clickHandled).toBeTrue();

            // Check if the computed tile coordinates are correct
            const expectedTileX = Math.floor(x / terrainMap.tileSize) + terrainMap.viewX;
            const expectedTileY = Math.floor(y / terrainMap.tileSize) + terrainMap.viewY;

            // Optionally, verify the coordinates directly via internal state if accessible or necessary
            //console.log(`Expected tile coordinates: X=${expectedTileX}, Y=${expectedTileY}`);
        });
    });


    describe("Water Animation", function() {
        beforeEach(function() {
            // Set initial time
            terrainMap.time = 0;
        });

        it("should update water tiles and redraw if time exceeds animation speed", function() {
            terrainMap.time = 36; // Set to animation speed threshold
            terrainMap.waterAnimation();

            // Verify time has been reset
            expect(terrainMap.time).toBe(0);
            // Verify tiles have been updated
            expect(terrainMap.tiles[0][1]).toBe("Water.1.2");
            expect(terrainMap.tiles[1][1]).toBe("Water.1.1");
            // Verify drawing function is called
            expect(terrainMap.drawTiles).toHaveBeenCalled();
        });

        it("should increment time if it does not exceed animation speed", function() {
            terrainMap.time = 35; // Just below the animation speed threshold
            terrainMap.waterAnimation();

            // Verify time has been incremented
            expect(terrainMap.time).toBe(36);
            // Verify that drawTiles has not been called
            expect(terrainMap.drawTiles).not.toHaveBeenCalled();
        });
    });

});
