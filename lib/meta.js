/**
 * meta takes care of global context e.g. error
 */

class Meta {
    constructor() {
        this.error = null // captures the first error
        this.errors = []
    }

    addError(e) {
        this.error = this.error || e
        this.errors.push(e)
    }
}

let meta = new Meta()

module.exports = {
    meta: meta,
    Meta: Meta
}