import invariant from 'invariant';

export default function getLocalCSSClassName(style, bsClass) {
  const className = style[bsClass];

  invariant(className, `style must contain class: ${bsClass}`);

  return className;
}
