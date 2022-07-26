// @ts-check

/**
 * @typedef {object} ImprovedNoFeeSwapResult
 * @property {Amount<'nat'>} amountIn
 * @property {Amount<'nat'>} amountOut
 */

/**
 * @typedef {object} FeePair
 *
 * @property {Amount<'nat'>} poolFee
 * @property {Amount<'nat'>} protocolFee
 */

/**
 * @typedef {object} PoolAllocation
 *
 * @property {Amount<'nat'>} Central
 * @property {Amount<'nat'>} Secondary
 */

/**
 * @typedef {object} NoFeeSwapFnInput
 * @property {Amount} amountGiven
 * @property {Amount} amountWanted
 * @property {Brand=} brand
 * @property {PoolAllocation} poolAllocation
 */

/**
 * This is the type for swapInNoFees and swapOutNoFees. pricesForStatedInput()
 * uses swapInNoFees, while pricesForStatedOutput() uses swapOutNoFees.
 *
 * @callback NoFeeSwapFn
 * @param {NoFeeSwapFnInput} input
 * @returns {ImprovedNoFeeSwapResult}
 */

/**
 * @typedef {FeePair & ImprovedNoFeeSwapResult} FeeEstimate
 */

/**
 * @callback CalculateFees
 * @param {Amount} amountGiven
 * @param {PoolAllocation} poolAllocation
 * @param {Amount} amountWanted
 * @param {Ratio} protocolFeeRatio
 * @param {Ratio} poolFeeRatio
 * @param {NoFeeSwapFn} swapFn
 * @returns {FeeEstimate}
 */

/**
 * @callback InternalSwap
 * @param {Amount} amountGiven
 * @param {PoolAllocation} poolAllocation
 * @param {Amount} amountWanted
 * @param {Ratio} protocolFeeRatio
 * @param {Ratio} poolFeeRatio
 * @param {NoFeeSwapFn} swapFn
 * @returns {SinglePoolSwapResult}
 */

/**
 * @callback CalcSwapInPrices
 * @param {Amount} amountGiven
 * @param {PoolAllocation} poolAllocation
 * @param {Amount=} amountWanted
 * @param {Ratio} protocolFeeRatio
 * @param {Ratio} poolFeeRatio
 * @returns {SinglePoolSwapResult}
 */
/**
 * @callback CalcSwapOutPrices
 * @param {Amount=} amountGiven
 * @param {PoolAllocation} poolAllocation
 * @param {Amount} amountWanted
 * @param {Ratio} protocolFeeRatio
 * @param {Ratio} poolFeeRatio
 * @returns {SinglePoolSwapResult}
 */

/**
 * @typedef {object} GetXYParam
 * @property {Amount=} amountGiven
 * @property {PoolAllocation} poolAllocation
 * @property {Amount=} amountWanted
 */

/**
 * @typedef {object} GetXYResultDeltaX
 * @property {Amount} x
 * @property {Amount} y
 * @property {Amount} deltaX
 * @property {Amount|undefined} deltaY
 */

/**
 * @typedef {object} GetXYResultDeltaY
 * @property {Amount} x
 * @property {Amount} y
 * @property {Amount} deltaY
 * @property {Amount|undefined} deltaX
 */

/**
 * @typedef {GetXYResultDeltaX & GetXYResultDeltaY} GetXYResult
 */

/**
 * @callback GetXY
 * @param {GetXYParam} obj
 * @returns {GetXYResult}
 */