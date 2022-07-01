import { APISchema, ValidatorLoader } from '@vulcan/core';
import { chain } from 'lodash';
import { SchemaParserMiddleware } from './middleware';

export const setConstraints =
  (loader: ValidatorLoader): SchemaParserMiddleware =>
  async (rawSchema, next) => {
    await next();
    const schema = rawSchema as APISchema;
    for (const request of schema.request || []) {
      request.constraints = chain(request.validators || [])
        .map((validator) => ({
          validator: loader.getLoader(validator.name),
          args: validator.args,
        }))
        .filter(({ validator }) => !!validator.getConstraints)
        .flatMap(({ validator, args }) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          validator.getConstraints!(args)
        )
        // Group by constraint class (RequiredConstraint, MinValueConstraint ....)
        .groupBy((constraint) => constraint.constructor.name)
        .values()
        .map((constraints) => {
          let mergeConstraint = constraints[0];
          constraints
            .slice(1)
            .forEach(
              (constraint) =>
                (mergeConstraint = mergeConstraint.compose(constraint))
            );
          return mergeConstraint;
        })
        .value();
    }
  };
