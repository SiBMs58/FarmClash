/**
 * This file contains the default data for the building map. This data is used to generate the starting building map.
 * Read the comments throughout the file to see how this data is structured.
 */

export const defaultBuildingMapData = {
    map_width: 58,
    map_height: 43,

    building_information: {
        townhall: { // The key for town hall needs to be "townhall"! This is used in getTownHallLVL() in buildingLayer
            self_key: "townhall",
            general_information: "Townhall",
            level: 0,
            unlock_level: 0,
            building_location:  [8, 16],
        },
        Silo: {
            self_key: "Silo",
            general_information: "Silo",
            level: 1,
            unlock_level: 0,
            building_location: [16, 9]
        },
        Barn: {
            self_key: "Barn",
            general_information: "Barn",
            level: 1,
            unlock_level: 0,
            building_location: [21, 15]
        },
        Bay: {
            self_key: "Bay",
            general_information: "Bay",
            level: 0,
            unlock_level: 1,
            building_location: [15, 0]
        },


        Pigpen1: {
            self_key: "Pigpen1",
            general_information: "Pigpen",
            level: 1,
            unlock_level: 0,
            building_location: [5, 5]
        },
        Pigpen2: {
            self_key: "Pigpen2",
            general_information: "Pigpen",
            level: 2,
            unlock_level: 3,
            building_location: [5, 26]
        },
        Pigpen3: {
            self_key: "Pigpen3",
            general_information: "Pigpen",
            level: 3,
            unlock_level: 6,
            building_location: [17, 40]
        },
        Pigpen4: {
            self_key: "Pigpen4",
            general_information: "Pigpen",
            level: 4,
            unlock_level: 9,
            building_location: [32, 40]
        },


        chicken_coop1: {
            self_key: "chicken_coop1",
            general_information: "Chickencoop",
            level: 1,
            unlock_level: 0,
            building_location: [5, 15]
        },
        chicken_coop2: {
            self_key: "chicken_coop2",
            general_information: "Chickencoop",
            level: 2,
            unlock_level: 3,
            building_location: [9, 26]
        },
        chicken_coop3: {
            self_key: "chicken_coop3",
            general_information: "Chickencoop",
            level: 3,
            unlock_level: 6,
            building_location: [33, 10]
        },
        chicken_coop4: {
            self_key: "chicken_coop4",
            general_information: "Chickencoop",
            level: 4,
            unlock_level: 9,
            building_location: [35, 36]
        },

        Cowbarn1: {
            self_key: "Cowbarn1",
            general_information: "Cowbarn",
            level: 1,
            unlock_level: 0,
            building_location: [16, 17]
        },
        Cowbarn2: {
            self_key: "Cowbarn2",
            general_information: "Cowbarn",
            level: 2,
            unlock_level: 4,
            building_location: [28, 9]
        },
        Cowbarn3: {
            self_key: "Cowbarn3",
            general_information: "Cowbarn",
            level: 3,
            unlock_level: 6,
            building_location: [17, 36]
        },
        Cowbarn4: {
            self_key: "Cowbarn4",
            general_information: "Cowbarn",
            level: 4,
            unlock_level: 9,
            building_location: [26, 49]
        },


        Goatbarn1: {
            self_key: "Goatbarn1",
            general_information: "Goatbarn",
            level: 1,
            unlock_level: 0,
            building_location: [5, 10]
        },
        Goatbarn2: {
            self_key: "Goatbarn2",
            general_information: "Goatbarn",
            level: 2,
            unlock_level: 4,
            building_location: [28, 5]
        },
        Goatbarn4: {
            self_key: "Goatbarn4",
            general_information: "Goatbarn",
            level: 3,
            unlock_level: 7,
            building_location: [4, 49]
        },
        Goatbarn3: {
            self_key: "Goatbarn3",
            general_information: "Goatbarn",
            level: 4,
            unlock_level: 9,
            building_location: [32, 45]
        },




        field1: {
            self_key: "field1",
            general_information: "Field3",
            level: 1,
            unlock_level: 0,
            building_location: [10, 8]
        },
        field2: {
            self_key: "field2",
            general_information: "Field3",
            level: 1,
            unlock_level: 0,
            building_location: [10, 11]
        },
        field50: {
            self_key: "field50",
            general_information: "Field3",
            level: 1,
            unlock_level: 0,
            building_location: [10, 5]
        },


        field3: {
            self_key: "field3",
            general_information: "Field3",
            level: 1,
            unlock_level: 1,
            building_location: [13, 11]
        },
        field4: {
            self_key: "field4",
            general_information: "Field3",
            level: 1,
            unlock_level: 1,
            building_location: [13, 8]
        },
        field49: {
            self_key: "field49",
            general_information: "Field3",
            level: 1,
            unlock_level: 1,
            building_location: [13, 5]
        },



        field5: {
            self_key: "field5",
            general_information: "Field3",
            level: 1,
            unlock_level: 2,
            building_location: [11, 22]
        },
        field6: {
            self_key: "field6",
            general_information: "Field3",
            level: 1,
            unlock_level: 2,
            building_location: [14, 22]
        },
        field7: {
            self_key: "field7",
            general_information: "Field3",
            level: 1,
            unlock_level: 2,
            building_location: [22, 10]
        },
        field8: {
            self_key: "field8",
            general_information: "Field3",
            level: 1,
            unlock_level: 2,
            building_location: [22, 4]
        },
        field9: {
            self_key: "field9",
            general_information: "Field3",
            level: 1,
            unlock_level: 2,
            building_location: [22, 7]
        },


        field14: {
            self_key: "field14",
            general_information: "Field3",
            level: 1,
            unlock_level: 3,
            building_location: [25, 4]
        },
        field15: {
            self_key: "field15",
            general_information: "Field3",
            level: 1,
            unlock_level: 3,
            building_location: [25, 7]
        },
        field16: {
            self_key: "field16",
            general_information: "Field3",
            level: 1,
            unlock_level: 3,
            building_location: [25, 10]
        },
        field17: {
            self_key: "field17",
            general_information: "Field3",
            level: 1,
            unlock_level: 3,
            building_location: [8, 22]
        },
        field18: {
            self_key: "field18",
            general_information: "Field3",
            level: 1,
            unlock_level: 3,
            building_location: [5, 22]
        },


        field21: {
            self_key: "field21",
            general_information: "Field3",
            level: 1,
            unlock_level: 4,
            building_location: [14, 25]
        },
        field22: {
            self_key: "field22",
            general_information: "Field3",
            level: 1,
            unlock_level: 4,
            building_location: [14, 28]
        },
        field23: {
            self_key: "field23",
            general_information: "Field3",
            level: 1,
            unlock_level: 4,
            building_location: [14, 31]
        },
        field41: {
            self_key: "field41",
            general_information: "Field3",
            level: 1,
            unlock_level: 4,
            building_location: [17, 28]
        },
        field45: {
            self_key: "field45",
            general_information: "Field3",
            level: 1,
            unlock_level: 4,
            building_location: [17, 25]
        },



        field31: {
            self_key: "field31",
            general_information: "Field3",
            level: 1,
            unlock_level: 5,
            building_location: [37, 4]
        },
        field32: {
            self_key: "field32",
            general_information: "Field3",
            level: 1,
            unlock_level: 5,
            building_location: [37, 7]
        },
        field33: {
            self_key: "field33",
            general_information: "Field3",
            level: 1,
            unlock_level: 5,
            building_location: [37, 10]
        },
        field43: {
            self_key: "field43",
            general_information: "Field3",
            level: 1,
            unlock_level: 5,
            building_location: [37, 13]
        },
        field35: {
            self_key: "field35",
            general_information: "Field3",
            level: 1,
            unlock_level: 5,
            building_location: [31, 22]
        },
        field42: {
            self_key: "field42",
            general_information: "Field3",
            level: 1,
            unlock_level: 5,
            building_location: [34, 22]
        },
        field36: {
            self_key: "field36",
            general_information: "Field3",
            level: 1,
            unlock_level: 5,
            building_location: [28, 22]
        },


        field24: {
            self_key: "field24",
            general_information: "Field3",
            level: 1,
            unlock_level: 6,
            building_location: [31, 25]
        },
        field34: {
            self_key: "field34",
            general_information: "Field3",
            level: 1,
            unlock_level: 6,
            building_location: [28, 25]
        },
        field25: {
            self_key: "field25",
            general_information: "Field3",
            level: 1,
            unlock_level: 6,
            building_location: [24, 33]
        },
        field26: {
            self_key: "field26",
            general_information: "Field3",
            level: 1,
            unlock_level: 6,
            building_location: [27, 33]
        },
        field27: {
            self_key: "field27",
            general_information: "Field3",
            level: 1,
            unlock_level: 6,
            building_location: [30, 33]
        },
        field44: {
            self_key: "field44",
            general_information: "Field3",
            level: 1,
            unlock_level: 6,
            building_location: [33, 33]
        },


        field19: {
            self_key: "field19",
            general_information: "Field3",
            level: 1,
            unlock_level: 7,
            building_location: [8, 47]
        },
        field20: {
            self_key: "field20",
            general_information: "Field3",
            level: 1,
            unlock_level: 7,
            building_location: [11, 47]
        },
        field10: {
            self_key: "field10",
            general_information: "Field3",
            level: 1,
            unlock_level: 7,
            building_location: [11, 41]
        },
        field11: {
            self_key: "field11",
            general_information: "Field3",
            level: 1,
            unlock_level: 7,
            building_location: [11, 44]
        },
        field12: {
            self_key: "field12",
            general_information: "Field3",
            level: 1,
            unlock_level: 7,
            building_location: [8, 41]
        },
        field13: {
            self_key: "field13",
            general_information: "Field3",
            level: 1,
            unlock_level: 7,
            building_location: [8, 44]
        },


         field46: {
            self_key: "field46",
            general_information: "Field3",
            level: 1,
            unlock_level: 8,
            building_location: [17, 44]
        },
         field37: {
            self_key: "field37",
            general_information: "Field3",
            level: 1,
            unlock_level: 8,
            building_location: [20, 44]
        },
        field28: {
            self_key: "field28",
            general_information: "Field3",
            level: 1,
            unlock_level: 8,
            building_location: [23, 44]
        },
        field29: {
            self_key: "field29",
            general_information: "Field3",
            level: 1,
            unlock_level: 8,
            building_location: [26, 44]
        },
        field30: {
            self_key: "field30",
            general_information: "Field3",
            level: 1,
            unlock_level: 8,
            building_location: [29, 44]
        },



        field38: {
            self_key: "field38",
            general_information: "Field3",
            level: 1,
            unlock_level: 9,
            building_location: [36, 41]
        },
        field39: {
            self_key: "field39",
            general_information: "Field3",
            level: 1,
            unlock_level: 9,
            building_location: [36, 44]
        },
        field40: {
            self_key: "field40",
            general_information: "Field3",
            level: 1,
            unlock_level: 9,
            building_location: [36, 47]
        },
        field47: {
            self_key: "field47",
            general_information: "Field3",
            level: 1,
            unlock_level: 9,
            building_location: [36, 51]
        },
        field48: {
            self_key: "field48",
            general_information: "Field3",
            level: 1,
            unlock_level: 9,
            building_location: [33, 51]
        },










        /**
        Always Place fences at the BOTTOM of the building information!
         */
        fence1: {
            self_key: "fence1",
            general_information: "Fence",
            level: 1,
            unlock_level: 0,
            building_location: [8, 8]
        },
        fence2: {
            self_key: "fence2",
            general_information: "Fence",
            level: 1,
            unlock_level: 0,
            building_location: [8, 9]
        },
        fence4: {
            self_key: "fence4",
            general_information: "Fence",
            level: 1,
            unlock_level: 0,
            building_location: [8, 10]
        },
        fence5: {
            self_key: "fence5",
            general_information: "Fence",
            level: 1,
            unlock_level: 0,
            building_location: [8, 11]
        },
        fence6: {
            self_key: "fence6",
            general_information: "Fence",
            level: 1,
            unlock_level: 0,
            building_location: [8, 12]
        },
        fence7: {
            self_key: "fence7",
            general_information: "Fence",
            level: 1,
            unlock_level: 0,
            building_location: [8, 13]
        },
        fence8: {
            self_key: "fence8",
            general_information: "Fence",
            level: 1,
            unlock_level: 0,
            building_location: [8, 14]
        },




        fence13: {
            self_key: "fence13",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [25, 17]
        },
        fence14: {
            self_key: "fence14",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [25, 18]
        },
        fence15: {
            self_key: "fence15",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [25, 19]
        },
        fence16: {
            self_key: "fence16",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [25, 20]
        },
        fence17: {
            self_key: "fence17",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [25, 21]
        },
        fence18: {
            self_key: "fence18",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [25, 16]
        },
        fence19: {
            self_key: "fence19",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [20, 30]
        },
        fence20: {
            self_key: "fence20",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [20, 31]
        },
        fence21: {
            self_key: "fence21",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [20, 32]
        },
        fence22: {
            self_key: "fence22",
            general_information: "Fence",
            level: 1,
            unlock_level: 6,
            building_location: [18, 46]
        },
        fence23: {
            self_key: "fence23",
            general_information: "Fence",
            level: 1,
            unlock_level: 6,
            building_location: [18, 47]
        },
        fence24: {
            self_key: "fence24",
            general_information: "Fence",
            level: 1,
            unlock_level: 6,
            building_location: [18, 48]
        },
        fence25: {
            self_key: "fence25",
            general_information: "Fence",
            level: 1,
            unlock_level: 6,
            building_location: [18, 49]
        },
        fence26: {
            self_key: "fence26",
            general_information: "Fence",
            level: 1,
            unlock_level: 6,
            building_location: [18, 50]
        },
        fence27: {
            self_key: "fence27",
            general_information: "Fence",
            level: 1,
            unlock_level: 6,
            building_location: [18, 51]
        },
        fence28: {
            self_key: "fence28",
            general_information: "Fence",
            level: 1,
            unlock_level: 5,
            building_location: [30, 32]
        },
        fence29: {
            self_key: "fence29",
            general_information: "Fence",
            level: 1,
            unlock_level: 5,
            building_location: [31, 32]
        },
        fence30: {
            self_key: "fence30",
            general_information: "Fence",
            level: 1,
            unlock_level: 5,
            building_location: [32, 32]
        },
        fence31: {
            self_key: "fence31",
            general_information: "Fence",
            level: 1,
            unlock_level: 5,
            building_location: [33, 32]
        },
        fence32: {
            self_key: "fence32",
            general_information: "Fence",
            level: 1,
            unlock_level: 5,
            building_location: [34, 32]
        },
        fence33: {
            self_key: "fence33",
            general_information: "Fence",
            level: 1,
            unlock_level: 5,
            building_location: [38, 45]
        },
        fence34: {
            self_key: "fence34",
            general_information: "Fence",
            level: 1,
            unlock_level: 10,
            building_location: [38, 46]
        },
        fence35: {
            self_key: "fence35",
            general_information: "Fence",
            level: 1,
            unlock_level: 10,
            building_location: [38, 47]
        },
        fence36: {
            self_key: "fence36",
            general_information: "Fence",
            level: 1,
            unlock_level: 10,
            building_location: [38, 48]
        },
        fence37: {
            self_key: "fence37",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [8, 30]
        },
        fence38: {
            self_key: "fence38",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [8, 31]
        },
        fence39: {
            self_key: "fence39",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [8, 32]
        },
        fence40: {
            self_key: "fence40",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [8, 33]
        },
        fence41: {
            self_key: "fence41",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [7, 33]
        },
        fence42: {
            self_key: "fence42",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [7, 30]
        },
        fence43: {
            self_key: "fence43",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [6, 30]
        },
        fence44: {
            self_key: "fence44",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [6, 33]
        },
        fence45: {
            self_key: "fence45",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [6, 31]
        },
        fence46: {
            self_key: "fence46",
            general_information: "Fence",
            level: 1,
            unlock_level: 3,
            building_location: [6, 32]
        },
        fence47: {
            self_key: "fence47",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [35, 4]
        },
        fence48: {
            self_key: "fence48",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [35, 5]
        },
        fence49: {
            self_key: "fence49",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [35, 6]
        },
        fence50: {
            self_key: "fence50",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [34, 4]
        },
        fence51: {
            self_key: "fence51",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [34, 5]
        },
        fence52: {
            self_key: "fence52",
            general_information: "Fence",
            level: 1,
            unlock_level: 4,
            building_location: [34, 6]
        },
        fence53: {
            self_key: "fence53",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [30, 50]
        },
        fence54: {
            self_key: "fence54",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [30, 51]
        },
        fence55: {
            self_key: "fence55",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [30, 52]
        },
        fence56: {
            self_key: "fence56",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [30, 49]
        },
        fence57: {
            self_key: "fence57",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [35, 48]
        },

        fence60: {
            self_key: "fence60",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [36, 49]
        },
        fence61: {
            self_key: "fence61",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [35, 49]
        },
        fence62: {
            self_key: "fence62",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [9, 50]
        },
        fence63: {
            self_key: "fence63",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [9, 51]
        },
        fence64: {
            self_key: "fence64",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [9, 52]
        },
        fence65: {
            self_key: "fence65",
            general_information: "Fence",
            level: 1,
            unlock_level: 7,
            building_location: [9, 53]
        },


        fence9: {
            self_key: "fence9",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 44]
        },
        fence10: {
            self_key: "fence10",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 45]
        },
        fence11: {
            self_key: "fence11",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 46]
        },
        fence12: {
            self_key: "fence12",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 47]
        },
        fence66: {
            self_key: "fence66",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 43]
        },
        fence67: {
            self_key: "fence67",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 42]
        },
        fence68: {
            self_key: "fence68",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 41]
        },
        fence69: {
            self_key: "fence69",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [35, 40]
        },
        fence70: {
            self_key: "fence70",
            general_information: "Fence",
            level: 1,
            unlock_level: 8,
            building_location: [36, 40]
        },


        fence71: {
            self_key: "fence71",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [37, 40]
        },
        fence72: {
            self_key: "fence72",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [38, 40]
        },
        fence73: {
            self_key: "fence73",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [38, 41]
        },
        fence74: {
            self_key: "fence74",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [38, 42]
        },
        fence75: {
            self_key: "fence75",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [38, 43]
        },
        fence76: {
            self_key: "fence76",
            general_information: "Fence",
            level: 1,
            unlock_level:9,
            building_location: [38, 44]
        },
        fence77: {
            self_key: "fence77",
            general_information: "Fence",
            level: 1,
            unlock_level: 9,
            building_location: [38, 45]
        },


        fence58: {
            self_key: "fence58",
            general_information: "Fence",
            level: 1,
            unlock_level: 10,
            building_location: [38, 49]
        },
        fence59: {
            self_key: "fence59",
            general_information: "Fence",
            level: 1,
            unlock_level: 10,
            building_location: [37, 49]
        },
    },


    building_general_information: {
        Chickencoop: { // This needs to be the name of the asset folder
            display_name: "Chicken coop", // Name to be displayed in the popup
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
            display_name: "Pig pen", // Name to be displayed in the popup
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
            display_name: "Cow barn", // Name to be displayed in the popup
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
            display_name: "Town hall", // Name to be displayed in the popup
            explanation: "This is the Town hall",
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
            display_name: "Field3",
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
        Field3: { // Don't change this name! It needs to correspond to the asset folder name.
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