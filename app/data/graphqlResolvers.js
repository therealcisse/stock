import { GraphQLNonNull } from 'graphql';
import invariant from 'invariant';

export default function graphqlResolvers(fields) {
  return fields.reduce(function(fields, fieldName) {
    fields[fieldName] = (obj, {}, {}, info) => {
      const value = obj[fieldName];
      if (info.returnType instanceof GraphQLNonNull) {
        invariant(
          !(value === null || value === undefined),
          'NonNull field: `' + fieldName + '` returned nothing.',
        );
      }
      return value === null || value === undefined ? null : value;
    };
    return fields;
  }, {});
}
