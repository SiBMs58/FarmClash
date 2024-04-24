export const utils = {
    /**
     * Return the directory of a given asset
     * @param assetName example: Grass.15.png or Grass.15
     * @returns {*}
     */
    getAssetDir(assetName) {
        return assetName.split('.')[0];
    },

    /**
     * Return the next frame of animatable tiles.
     * @param assetName example: Water.1.1
     * @returns {*} example: Water.1.2
     */
    getNextAssetName(assetName) {
        return assetName.replace(/([12])$/, match => match === '1' ? '2' : '1');
    }
};