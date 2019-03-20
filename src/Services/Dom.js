class Dom {
  /**
   * Replaces children in parent element
   * @param {Element[]} children
   * @param {Element} parentRef
   * @param clearHtml
   */
  static insert (children, parentRef, clearHtml = true) {
    if (clearHtml) {
      parentRef.innerHTML = ''
    }
    children.map(child =>
      parentRef.appendChild(child)
    )
  }
}

export default Dom
