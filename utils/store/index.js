exports.mapToData = require('./api/mapToData')
exports.observe = require('./api/observe')
exports.update = (obj) => {
    Object.keys(obj).forEach(key => {
        this[key] = obj[key]
    })
}