class Library {
    generateRandomString(length = 10) {
        let result = ""
        for (let i = 0; i < length; i++) {
            const randomNumber = _.random(0, 9)
            result += randomNumber.toString()
        }
        return result
    }
    /** transform an echo property of a given module into reactive pinia store, **_pinia_store** is reserved and cannot be used as an echo property */
    resonate(module: AnyObject) {
        if (module.echo) module.echo = this.resonateObject(module.echo)
        return module
    }
    /** transform an object into reactive pinia store, ignores but saves fns, **_pinia_store** is reserved and cannot be used as a property */
    resonateObject(unresolved_object: AnyObject) {
        // may be class instance, which conflict with pinia store
        const object = _.toPlainObject(unresolved_object)
        const functions = {}
        _.forEach(object, (value, key) => {
            if (typeof value === "function") {
                functions[key] = value
                delete object[key]
            }
        })
        const storeObject: AnyObject = {}
        storeObject._pinia_store = defineStore(this.generateRandomString(), {
            state: () => object,
        })
        _.forEach(object, (value, key) => {
            Object.defineProperty(storeObject, key, {
                get: () => storeObject._pinia_store()[key],
                set: (value) => {
                    storeObject._pinia_store()[key] = value
                },
                enumerable: true,
                configurable: true,
            })
        })
        _.forEach(functions, (value, key) => {
            storeObject[key] = value
        })
        return storeObject
    }
}
export const LIBRARY = new Library()

import lodash from "lodash"
export const _ = lodash
