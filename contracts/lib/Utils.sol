//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'hardhat/console.sol';


library UtilsUint {
    /**
     * Creates an array of uint with one element.
     * @param element:  Uint to create an array of.
     */
    function asSingleton(uint element) external pure returns (uint[] memory) {
        uint[] memory array = new uint[](1);
        array[0] = element;
        return array;
    }

    /**
     Get a percentage of a pool amount. Good for dividing up coins. Handles up to 2 decimal places.
     * @param pool_amount:  Total amount to get a percentage of
     * @param shares:       In decimal format * 10_000 (e.g. 5% is .05 => 500, 25% is .25 => 2500)
     */
    function split(uint pool_amount, uint shares) external pure returns (uint) {
        uint bp = 10000;    // Base point
        require(pool_amount >= bp, "Too small to compute");
        return pool_amount * shares / bp;
    }

    /**
     * Check if block.timestamp has exceeded the allotted window.
     * @param base:         The last time an action was taken
     * @param duration:     Duration
     */
    function window(uint base, uint delay) external view returns (uint) {
        uint rn = block.timestamp;
        uint release_time = base + delay;
        return rn >= release_time ? 0 : release_time - rn;
    }
}