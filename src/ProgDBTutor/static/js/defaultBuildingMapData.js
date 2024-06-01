export const defaultBuildingMapData = {
    map_width: 58,
    map_height: 43,

    building_information: {
        townhall: { // The key for town hall needs to be "townhall"! This is used in getTownHallLVL() in buildingLayer
            self_key: "townhall",
            general_information: "Townhall",
            level: 8,
            unlock_level: 2,
            building_location:  [4, 19],
        },

        chicken_coop: {
            self_key: "chicken_coop",
            general_information: "Chicken_house",
            level: 3,
            unlock_level: 3,
            building_location: [5, 11]
        },

        field1: {
            self_key: "field1",
            general_information: "Field",
            level: 1,
            unlock_level: 3,
            building_location: [10, 8]
        },
        field2: {
            self_key: "field2",
            general_information: "Field",
            level: 1,
            unlock_level: 3,
            building_location: [10, 12]
        },
        field3: {
            self_key: "field3",
            general_information: "Field",
            level: 1,
            unlock_level: 3,
            building_location: [10, 16]
        },

        Cowbarn: {
            self_key: "Cowbarn",
            general_information: "Cowbarn",
            level: 5,
            unlock_level: 3,
            building_location: [10, 24]
        },
        Goatbarn: {
            self_key: "Goatbarn",
            general_information: "Goatbarn",
            level: 10,
            unlock_level: 3,
            building_location: [15, 24]
        },
        Bay: {
            self_key: "Bay",
            general_information: "Bay",
            level: 10,
            unlock_level: 3,
            building_location: [15, 3]
        },
        Pigpen: {
            self_key: "Pigpen",
            general_information: "Pigpen",
            level: 10,
            unlock_level: 3,
            building_location: [5, 3]
        },
        Silo: {
            self_key: "Silo",
            general_information: "Silo",
            level: 10,
            unlock_level: 3,
            building_location: [10, 3]
        },


        /**
        Always Place fences at the BOTTOM of the building information!
         */
        fence1: {
            self_key: "fence1", // Must be the exact key of this sub-object
            general_information: "Fence", // Link to the general information of this building type
            level: 4, // Building level (set "None" if not relevant)
            unlock_level: 4, // Set this to the town hall level when you want this building to be unlocked
            building_location: [8, 8] // --> [y (height), x (width)], this needs to be the top-left corner of the building
        },
        fence2: {
            self_key: "fence2",
            general_information: "Fence",
            level: 4,
            unlock_level: 4,
            building_location: [8, 9]
        },
        fence4: {
            self_key: "fence4",
            general_information: "Fence",
            level: 4,
            unlock_level: 4,
            building_location: [8, 10]
        },
        fence5: {
            self_key: "fence5",
            general_information: "Fence",
            level: 4,
            unlock_level: 4,
            building_location: [8, 11]
        },
        fence6: {
            self_key: "fence6",
            general_information: "Fence",
            level: 8,
            unlock_level: 3,
            building_location: [8, 12]
        },
        fence7: {
            self_key: "fence7",
            general_information: "Fence",
            level: 8,
            unlock_level: 3,
            building_location: [8, 13]
        },
        fence8: {
            self_key: "fence8",
            general_information: "Fence",
            level: 8,
            unlock_level: 3,
            building_location: [8, 14]
        },
        fence9: {
            self_key: "fence9",
            general_information: "Fence",
            level: 8,
            unlock_level: 5,
            building_location: [8, 15]
        },
        fence10: {
            self_key: "fence10",
            general_information: "Fence",
            level: 8,
            unlock_level: 5,
            building_location: [8, 16]
        },
        fence11: {
            self_key: "fence11",
            general_information: "Fence",
            level: 8,
            unlock_level: 5,
            building_location: [8, 17]
        },

    },


    building_general_information: {
        Chicken_house: {
            display_name: "Chicken House", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Chickencoop.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Chickencoop.L@.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[1, 0], "Chickencoop.L@.2.1"], // All the '@' will be replaced with the correct level
                [[1, 1], "Chickencoop.L@.2.2"],
                [[2, 0], "Chickencoop.3.1"],
                [[2, 1], "Chickencoop.3.2"],
            ]
        },
        Pigpen: {
            display_name: "Pigpen", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Pigpen.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Pigpen.L@.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[0, 2], "Pigpen.L@.1.3"],
                [[1, 0], "Pigpen.L@.2.1"], // All the '@' will be replaced with the correct level
                [[1, 1], "Pigpen.2.2"],
                [[1, 2], "Pigpen.L@.2.3"],
                [[2, 0], "Pigpen.3.1"],
                [[2, 1], "Pigpen.3.2"],
                [[2, 2], "Pigpen.3.3"]
            ]
        },
        Cowbarn: {
            display_name: "Cowbarn", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Cowbarn.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Cowbarn.L@.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[0, 2], "Cowbarn.L@.1.3"], // All the '@' will be replaced with the correct level
                [[1, 0], "Cowbarn.L@.2.1"],
                [[1, 1], "Cowbarn.2.2"],
                [[1, 2], "Cowbarn.L@.2.3"],
                [[2, 0], "Cowbarn.3.1"],
                [[2, 1], "Cowbarn.3.2"],
                [[2, 2], "Cowbarn.3.3"]
            ]
        },
        Goatbarn: {
            display_name: "Goat barn", // Name to be displayed in the popup
            explanation: "Dive into the heart of your farm's egg production with the Chicken House. " +
                "This vital building is where your feathered friends lay eggs, ready for " +
                "market sale. Upgrade to boost production. Every egg sold brings you one " +
                "step closer to agricultural dominance.",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Eggs/hour", [1, 2, 3, 4, 5, 6, 7]], ["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Goatbarn.L@.1.1"], // location relative to 'building_location'
                [[0, 1], "Goatbarn.L@.1.2"], // [ rel_location ([y, x]), "Tile asset"]
                [[0, 2], "Goatbarn.L@.1.3"], // All the '@' will be replaced with the correct level
                [[1, 0], "Goatbarn.L@.2.1"],
                [[1, 1], "Goatbarn.2.2"],
                [[1, 2], "Goatbarn.L@.2.3"],
                [[2, 0], "Goatbarn.3.1"],
                [[2, 1], "Goatbarn.3.2"],
                [[2, 2], "Goatbarn.3.3"]
            ]
        },

        Townhall: {
            display_name: "Townhall", // Name to be displayed in the popup
            explanation: "This is the Townhall",
            upgrade_costs: [500, 1000, 2000, 3500, 5000, 7000], // All costs per level starting from level 2 (in this case level1 -> level2 costs 500 coins)
            other_stats: [["Defence", [50, 100, 150, 200, 400, 470, 550]]], // All other stats specific for this building. ["Stat name display", [array of all values per level]]
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Townhall.L@.1.1"],
                [[0, 1], "Townhall.L@.1.2"],
                [[0, 2], "Townhall.L@.1.3"],
                [[0, 3], "Townhall.1.4"],
                [[1, 0], "Townhall.L@.2.1"],
                [[1, 1], "Townhall.L@.2.2"],
                [[1, 2], "Townhall.L@.2.3"],
                [[1, 3], "Townhall.L@.2.4"],
                [[2, 0], "Townhall.L@.3.1"],
                [[2, 1], "Townhall.L@.3.2"],
                [[2, 2], "Townhall.L@.3.3"],
                [[2, 3], "Townhall.L@.3.4"],
                [[3, 0], 'Townhall.4.1'],
                [[3, 1], 'Townhall.4.2'],
                [[3, 2], 'Townhall.4.3'],
                [[3, 3], 'Townhall.4.4'],
                [[4, 0], 'Townhall.5.1'],
                [[4, 1], 'Townhall.5.2'],
                [[4, 2], 'Townhall.5.3'],
                [[4, 3], 'Townhall.5.4']
            ]
        },
        Fence: {
            display_name: "Fence",
            explanation: "Strategically place your fences in order to defend you farm from intruders as effectively as possible.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0, 0], "Fence.L@"], // This will be replaced with the correct type of fence according to its neighbours.
            ]
        },/*
        Field: {
            display_name: "Field",
            explanation: "This is a field.\nSelect a crop",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0], "Field2.TL"],
                [[0,1], "Field2.T"],
                [[0,2], "Field2.T"],
                [[0,3], "Field2.TR"],

                [[1,0], "Field2.L"],
                [[1,1], "Field2.M"],
                [[1,2], "Field2.M"],
                [[1,3], "Field2.R"],

                [[2,0], "Field2.L"],
                [[2,1], "Field2.M"],
                [[2,2], "Field2.M"],
                [[2,3], "Field2.R"],

                [[3,0], "Field2.BL"],
                [[3,1], "Field2.B"],
                [[3,2], "Field2.B"],
                [[3,3], "Field2.BR"],
            ]
        },*/
        Field: {
            display_name: "Field",
            explanation: "This is a field.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0], "Field3.TL"],
                [[0,1], "Field3.TR"],
                [[1,0], "Field3.BL"],
                [[1,1], "Field3.BR"],
            ]
        },
        Barn: {
            display_name: "Barn",
            explanation: "This is a barn.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0],"Barn.L@.1.1"],
                [[1,0],"Barn.L@.2.1"],
                [[2,0],"Barn.3.1"],
                [[0,1],"Barn.L@.1.2"],
                [[1,1],"Barn.2.2"],
                [[2,1],"Barn.3.2"],
                [[0,2],"Barn.L@.1.3"],
                [[1,2],"Barn.L@.2.3"],
                [[2,2],"Barn.3.3"]
            ]
        },
        Bay: {
            display_name: "Bay",
            explanation: "This is a bay.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[1,0],"Bay.L@.2.1.F1"],
                [[2,0],"Bay.L@.3.1.F1"],
                [[3,0],"Bay.L@.4.1.F1"],
                [[1,1],"Bay.L@.2.2.F1"],
                [[2,1],"Bay.L@.3.2.F1"],
                [[3,1],"Bay.L@.4.2.F1"],
                [[4,1],"Bay.L@.5.2.F1"],
                [[1,2],"Bay.L@.2.3.F1"],
                [[2,2],"Bay.L@.3.3.F1"],
                [[3,2],"Bay.L@.4.3.F1"],
                [[0,3],"Bay.L@.1.4"],
                [[1,3],"Bay.L@.2.4"],
                [[2,3],"Bay.L@.3.4"],
                [[3,3],"Bay.L@.4.4"],
                [[4,3],"Bay.L@.5.4"],
                [[0,4],"Bay.L@.1.5"],
                [[1,4],"Bay.L@.2.5"],
                [[2,4],"Bay.L@.3.5"],
                [[3,4],"Bay.L@.4.5"],
                [[4,4],"Bay.L@.5.5"],
                [[0,5],"Bay.L@.1.6"],
                [[1,5],"Bay.L@.2.6"],
                [[2,5],"Bay.L@.3.6"],
                [[3,5],"Bay.L@.4.6"],
                [[4,5],"Bay.L@.5.6"]
            ],
        },
        Silo: {
            display_name: "Silo",
            explanation: "This is a silo.",
            upgrade_costs: [500, 1000, 2000, 3500],
            other_stats: [["Defence", [50, 100, 150, 200, 400]]],
            maxLevel: 10,
            tile_rel_locations: [
                [[0,0],"Silo.L@.1.1"],
                [[1,0],"Silo.0%.2.1"],
                [[2,0],"Silo.0%.3.1"],
                [[3,0],"Silo.0%.4.1"],
                [[4,0],"Silo.0%.5.1"],
                [[0,1],"Silo.L@.1.2"],
                [[1,1],"Silo.0%.2.2"],
                [[2,1],"Silo.0%.3.2"],
                [[3,1],"Silo.0%.4.2"],
                [[4,1],"Silo.0%.5.2"],
                [[0,2],"Silo.L@.1.3"],
                [[1,2],"Silo.0%.2.3"],
                [[2,2],"Silo.0%.3.3"],
                [[3,2],"Silo.0%.4.3"],
                [[4,2],"Silo.0%.5.3"]
            ]
        }
    }
}