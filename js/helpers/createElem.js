export default function createElem(elem, classes, child, parent) {
  let element;
  if (elem) element = document.createElement(elem);
  if (classes) classes.forEach((classItem) => element.classList.add(classItem));
  if (child && typeof child === 'string') {
    element.innerHTML = child;
  } else if (child && Array.isArray(child)) {
    child.forEach((childItem) => element.append(childItem));
  }
  if (parent) parent.append(element);
  return element;
}
