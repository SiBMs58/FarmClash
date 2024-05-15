//TODO functions that can be used to determine which field cloud and fence asset should be used
// should be changed a bit so the it reads from the buildingLayer


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function getFieldAsset(level,x, y) {
    let buildingMap = [
        ["Field", 0, "Field"],
        ["Field", 0, "Field"],
        [0, "Field", 0],
        [0, "Field", 0],
        ["Field", 0, 0]
    ];
    if (x < 0 || y < 0 || y > buildingMap.length || x > buildingMap[0].length) {
        return '';
    }

    let north= y-1>=0 && buildingMap[y-1][x].startsWith("Field");
    let east= x+1>=0 && buildingMap[y][x+1].startsWith("Field");
    let south= y+1>=0 && buildingMap[y+1][x].startsWith("Field");
    let west= x-1>=0 && buildingMap[y][x-1].startsWith("Field");

    let northeast= north && east && buildingMap[y-1][x+1].startsWith("Field");
    let northwest= north && west && buildingMap[y-1][x-1].startsWith("Field");
    let southeast= south && east && buildingMap[y+1][x+1].startsWith("Field");
    let southwest= south && west && buildingMap[y+1][x-1].startsWith("Field");

    let asset = `Field.L${level}${north || east || south || west ? '.' : ''}`;
    asset += `${north ? 'N' : ''}${northeast ? ',' : ''}${east ? 'O' : ''}${southeast ? ',' : ''}`
    asset += `${south ? 'Z' : ''}${southwest ? ',' : ''}${west ? 'W' : ''}${northwest ? ',' : ''}.png`

    return asset;
}

function getCloudAsset(x, y) {
    let cloudMap = [
        ["Clouds", 0, "Clouds"],
        ["Clouds", 0, "Clouds"],
        [0, "Clouds", 0],
        [0, "Clouds", 0],
        ["Clouds", 0, 0]
    ];
    if (x < 0 || y < 0 || y > cloudMap.length || x > cloudMap[0].length) {
        return '';
    }


    let north= y-1>=0 && cloudMap[y-1][x].startsWith("Clouds");
    let east= x+1>=0 && cloudMap[y][x+1].startsWith("Clouds");
    let south= y+1>=0 && cloudMap[y+1][x].startsWith("Clouds");
    let west= x-1>=0 && cloudMap[y][x-1].startsWith("Clouds");

    let northeast= north && east && cloudMap[y-1][x+1].startsWith("Clouds");
    let northwest= north && west && cloudMap[y-1][x-1].startsWith("Clouds");
    let southeast= south && east && cloudMap[y+1][x+1].startsWith("Clouds");
    let southwest= south && west && cloudMap[y+1][x-1].startsWith("Clouds");

    let neighbors = (north ? 1 : 0) + (east ? 1 : 0) + (south ? 1 : 0) + (west ? 1 : 0);
    let diagonalNeighbors = (northeast ? 1 : 0) + (northwest ? 1 : 0) + (southeast ? 1 : 0) + (southwest ? 1 : 0);
    if(neighbors === 4 && diagonalNeighbors ===3){
        return `Clouds.!${!northeast ? 'NO' : ''}${!southeast ? 'OZ' : ''}${!southwest ? 'ZW' : ''}${!northwest ? 'NW' : ''}.png`;
    } else if (neighbors === 4){
        return `Clouds${getRandomInt(1, 8)}.png`

    } else if (neighbors === 3){
        return `Clouds.${north ? 'N' : ''}${east ? 'O' : ''}${south ? 'Z' : ''}${west ? 'W' : ''}.${getRandomInt(1, 4)}.png`

    }else if(neighbors === 2){
        return `Clouds.${north ? 'N' : ''}${east ? 'O' : ''}${south ? 'Z' : ''}${west ? 'W' : ''}.png`
    }
    return ''
}

function getFenceAsset(x, y, level) {
    let buildingMap = [
        ["Fence", 0, "Fence"],
        ["Fence", 0, "Fence"],
        [0, "Fence", 0],
        [0, "Fence", 0],
        ["Fence", 0, 0]
    ];
    if (x < 0 || y < 0 || y > buildingMap.length || x > buildingMap[0].length) {
        return '';
    }

    let north= y-1>=0 && buildingMap[y-1][x].startsWith("Fence");
    let east= x+1>=0 && buildingMap[y][x+1].startsWith("Fence");
    let south= y+1>=0 && buildingMap[y+1][x].startsWith("Fence");
    let west= x-1>=0 && buildingMap[y][x-1].startsWith("Fence");
    return `Fence.L${level}${north || east || south || west ? '.' : ''}${north ? 'N' : ''}${east ? 'O' : ''}${south ? 'Z' : ''}${west ? 'W' : ''}.png`
}