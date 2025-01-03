const shortid = require('shortid');

/**
 * 获取uuid
 * @returns {string}
 */
function createUuid() {
    let _orderid = shortid.generate();
    _orderid = _orderid.replace(/-/g, 'A').replace(/_/g, 'a');
    return _orderid;
}

module.exports = {
    createUuid,
};
