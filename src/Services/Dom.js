class Dom {
  /**
   * Replaces children in parent element
   * @param {Element[]} children
   * @param {Element} parentRef
   */
  static insert (children, parentRef) {
    parentRef.innerHTML = ''
    children.map(child =>
      parentRef.appendChild(child)
    )
  }
}

export default Dom
