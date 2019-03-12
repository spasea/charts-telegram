class Easing {
  /**
   * Returns the easing
   * @param {number} value [0, 1]
   * @returns {number}
   */
  static easeInOut (value) {
    return value < 0.5
      ? 4 * Math.pow(value, 3)
      : (value - 1) * Math.pow(2 * value - 2, 2) + 1
  }
}

export default Easing
