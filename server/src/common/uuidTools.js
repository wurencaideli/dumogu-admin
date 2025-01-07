import shortid from 'shortid';

/**
 * 获取uuid
 * @returns {string}
 */
export function createUuid() {
    let _orderid = shortid.generate();
    _orderid = _orderid.replace(/-/g, 'A').replace(/_/g, 'a');
    return _orderid;
}