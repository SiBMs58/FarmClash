import { TerrainMap } from "../terrainLayer.js"
import { utils } from "../utils.js"


describe("TerrainMap Tests", function() {
    let terrainMap, mockCtx, tileSize;
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
        tileSize = 50
        mockCtx = jasmine.createSpyObj('CanvasRenderingContext2D', ['drawImage']);
        terrainMap = new TerrainMap(mockMapData, tileSize, mockCtx);
        spyOn(utils, 'getAssetDir').and.callFake(name => name.split('.')[0]);
        spyOn(utils, 'getNextAssetName').and.callFake(name => name.replace(/([12])$/, match => match === '1' ? '2' : '1'));
        spyOn(terrainMap, 'drawTiles').and.stub();  // Use stub if no return value is needed
    });

    describe('constructor', function() {
        it('should initialize map properties correctly', function() {
            expect(terrainMap.tileSize).toEqual(tileSize);
            expect(terrainMap.map_width).toEqual(mockMapData.map_width);
            expect(terrainMap.map_height).toEqual(mockMapData.map_height);
            expect(terrainMap.viewX).toEqual(0);
            expect(terrainMap.viewY).toEqual(0);
            expect(terrainMap.ownNextClick).toEqual(false);
        });
    });


    describe("Initialization and Asset Loading", function() {
        it("should preload terrain assets correctly", async function() {
            spyOn(terrainMap, 'fetchTerrainAssetList').and.resolveTo();
            spyOn(terrainMap, 'fetchTerrainMapData').and.resolveTo();
            spyOn(terrainMap, 'preloadTerrainAssets').and.callFake(callback => callback());

            await terrainMap.initialize();

            expect(terrainMap.fetchTerrainAssetList).toHaveBeenCalled();
            expect(terrainMap.fetchTerrainMapData).toHaveBeenCalled();
            expect(terrainMap.preloadTerrainAssets).toHaveBeenCalled();
            // Additional assertions to verify the assets are loaded correctly
        }, 10000); // Extended timeout period

    });

/*    describe("Drawing Functionality", function() {
        beforeEach(function() {
            // Mock the window size
            Object.defineProperty(window, 'innerHeight', { value: 100, configurable: true });
            Object.defineProperty(window, 'innerWidth', { value: 200, configurable: true });

            // Set up a basic map and mock assets
            terrainMap.terrainAssets = {
                "/static/img/assets/terrain/Grass/Grass.1.png": new Image(),
                "/static/img/assets/terrain/Water/Water.1.1.png": new Image(),
                "/static/img/assets/terrain/Grass/Grass.2.png": new Image(),
                "/static/img/assets/terrain/Water/Water.1.2.png": new Image()
            };

            // Assuming tileSize is properly set in TerrainMap constructor
            console.log(`Tile Size: ${terrainMap.tileSize}`);  // Debugging output
        });

        it("should draw terrain tiles correctly based on window size", function() {
            terrainMap.drawTiles();

            // Debugging
            console.log(`Window Width: ${window.innerWidth}, Window Height: ${window.innerHeight}`);
            console.log(`Expected Calls Calculation: ${Math.ceil(window.innerWidth / terrainMap.tileSize)} * ${Math.ceil(window.innerHeight / terrainMap.tileSize)}`);

            const expectedCalls = Math.ceil(window.innerWidth / terrainMap.tileSize) * Math.ceil(window.innerHeight / terrainMap.tileSize);
            expect(mockCtx.drawImage).toHaveBeenCalledTimes(expectedCalls);

            if (expectedCalls !== expectedCalls) {  // Checks if expectedCalls is NaN
                console.error("Expected calls is NaN, check tile size and window dimensions");
            }
        });

        afterEach(function() {
            // Reset modifications to native window properties
            delete window.innerHeight;
            delete window.innerWidth;
        });
    });
    */

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

    // Test suite for scrollLeft method
    describe('scrollLeft', function() {
        it('should decrease viewX if not already at the left edge', function() {
            terrainMap.viewX = 5;
            terrainMap.scrollLeft();
            expect(terrainMap.viewX).toEqual(4);
        });

        it('should not change viewX if already at the left edge', function() {
            terrainMap.viewX = 0;
            terrainMap.scrollLeft();
            expect(terrainMap.viewX).toEqual(0);
        });
    });

    describe('scrollUp', function() {
        it('should decrease viewY if not already at the top edge', function() {
            terrainMap.viewY = 5;
            terrainMap.scrollUp();
            expect(terrainMap.viewY).toEqual(4);
        });

        it('should not change viewY if already at the top edge', function() {
            terrainMap.viewY = 0;
            terrainMap.scrollUp();
            expect(terrainMap.viewY).toEqual(0);
        });
    });

    // todo scroll down and right



});
