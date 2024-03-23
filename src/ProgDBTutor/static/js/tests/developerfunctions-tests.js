import { getRandomElement, generateRandomTerrainMap } from '../developerFunctions.js';
describe("Developer Functions Tests", function() {
    describe("getRandomElement", function() {
        it("should return an element from the provided list", function() {
            const list = [1, 2, 3, 4, 5];
            const element = getRandomElement(list);
            expect(list).toContain(element);
        });
    });

    describe("generateRandomTerrainMap", function() {
        const width = 10;
        const height = 5;
        let map;

        beforeAll(function() {
            map = generateRandomTerrainMap(width, height);
        });

        it("should return an object with map dimensions and terrain_tiles", function() {
            expect(map).toEqual(jasmine.objectContaining({
                map_width: width,
                map_height: height,
                terrain_tiles: jasmine.any(Array)
            }));
        });

        it("should create terrain_tiles array with specified dimensions", function() {
            expect(map.terrain_tiles.length).toBe(height);
            map.terrain_tiles.forEach(row => {
                expect(row.length).toBe(width);
            });
        });

        it("should fill terrain_tiles with elements from the defaultTileSet", function() {
            // Assuming defaultTileSet is accessible. If not, you may need to adjust the scope or test differently.
            map.terrain_tiles.flat().forEach(tile => {
                expect(defaultTileSet).toContain(tile);
            });
        });

        it("allows overriding the defaultTileSet for terrain tiles", function() {
            const customTiles = ["CustomTile.1", "CustomTile.2"];
            const customMap = generateRandomTerrainMap(width, height, customTiles);
            customMap.terrain_tiles.flat().forEach(tile => {
                expect(customTiles).toContain(tile);
            });
        });
    });

    // Additional tests can be implemented as needed for other functions or edge cases.
});
