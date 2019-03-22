class Throttle {
  static execute(cb, delay) {
    let isThrottled = false
    let savedArgs
    let savedThis

    function wrapper() {
      if (isThrottled) {
        savedArgs = arguments
        savedThis = this
        return
      }

      cb.apply(this, arguments)

      isThrottled = true

      setTimeout(() => {
        isThrottled = false
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs)
          savedArgs = null
          savedThis = null
        }
      }, delay)
    }

    return wrapper
  }
}

export default Throttle
