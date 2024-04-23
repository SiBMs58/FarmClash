export const utils = {
    getAssetDir(assetName) {
        return assetName.split('.')[0];
    },
    getNextAssetName(assetName) {
        return assetName.replace(/([12])$/, match => match === '1' ? '2' : '1');
    }
};