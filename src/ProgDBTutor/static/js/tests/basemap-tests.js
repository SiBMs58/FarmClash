// Import the BaseMap class
import { BaseMap } from '../BaseMapKlasse.js';

// Describe block for the BaseMap class
describe('BaseMap', function() {
    // Define test variables
    let mapData, tileSize, baseMap;

    // BeforeEach block to set up test environment
    beforeEach(function() {
        // Initialize test variables
        mapData = {
            map_width: 10,
            map_height: 10
        };
        tileSize = 32; // Assuming tileSize of 32 for the test
        baseMap = new BaseMap(mapData, tileSize);
    });

    // Test suite for constructor
    describe('constructor', function() {
        it('should initialize map properties correctly', function() {
            expect(baseMap.tileSize).toEqual(tileSize);
            expect(baseMap.map_width).toEqual(mapData.map_width);
            expect(baseMap.map_height).toEqual(mapData.map_height);
            expect(baseMap.viewX).toEqual(0);
            expect(baseMap.viewY).toEqual(0);
            expect(baseMap.ownNextClick).toEqual(false);
        });
    });

    // Test suite for isValidTilePosition method
    describe('isValidTilePosition', function() {
        it('should return true for valid tile positions', function() {
            expect(baseMap.isValidTilePosition(0, 0)).toBeTrue();
            expect(baseMap.isValidTilePosition(5, 5)).toBeTrue();
            expect(baseMap.isValidTilePosition(9, 9)).toBeTrue();
        });

        it('should throw an error for invalid tile positions', function() {
            expect(function() { baseMap.isValidTilePosition(-1, 0); }).toThrow();
            expect(function() { baseMap.isValidTilePosition(0, -1); }).toThrow();
            expect(function() { baseMap.isValidTilePosition(10, 0); }).toThrow();
            expect(function() { baseMap.isValidTilePosition(0, 10); }).toThrow();
        });
    });

    // Test suite for scrollLeft method
    describe('scrollLeft', function() {
        it('should decrease viewX if not already at the left edge', function() {
            baseMap.viewX = 5;
            baseMap.scrollLeft();
            expect(baseMap.viewX).toEqual(4);
        });

        it('should not change viewX if already at the left edge', function() {
            baseMap.viewX = 0;
            baseMap.scrollLeft();
            expect(baseMap.viewX).toEqual(0);
        });
    });

    // Similarly, you can add tests for other methods like scrollUp, scrollRight, scrollDown, and drawTiles.
});
