/** Une clases CSS ignorando valores falsos: cx('a', false, 'b') → 'a b' */
export const cx = (...classes) => classes.filter(Boolean).join(' ')
