class Coordinates {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  get value () {
    return [this.x, this.y]
  }
}

export default Coordinates
