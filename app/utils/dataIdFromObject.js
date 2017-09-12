export default function dataIdFromObject({ id, __typename }) {
  if (id && __typename) {
    return __typename + '-' + id;
  }
  return null;
}
