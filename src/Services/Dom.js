class Dom {
  /**
   * Replaces children in parent element
   * @param {HTMLElement[]} children
   * @param {HTMLElement} parentRef
   */
  static insert (children, parentRef) {
    parentRef.innerHTML = ''
    children.map(child =>
      parentRef.appendChild(child)
    )
  }
}

export default Dom
