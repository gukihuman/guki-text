// import * as lodash from "lodash"

// _.debounce implementation
class myLodash {
  public debounce(func, wait, immediate = false) {
    let timeout

    return function executedFunction() {
      const context = this
      const args = arguments

      const later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }

      const callNow = immediate && !timeout
      clearTimeout(timeout)

      timeout = setTimeout(later, wait)

      if (callNow) func.apply(context, args)
    }
  }

  // _.forEach implementation
  public forEach(collection, iteratee) {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iteratee(collection[i], i)
      }
    } else if (typeof collection === "object") {
      for (let key in collection) {
        if (collection.hasOwnProperty(key)) {
          iteratee(collection[key], key)
        }
      }
    }
  }
}

export const _ = new myLodash()
