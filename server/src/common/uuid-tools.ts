import shortid from 'shortid';

/**
 * 获取uuid
 */
export function createUuid(): string {
    const _orderid = shortid.generate().replace(/-/g, 'A').replace(/_/g, 'a');
    return _orderid;
}
