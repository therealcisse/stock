import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import invariant from 'invariant';

import { DOC_FOREIGN_KEY } from 'data/constants';

export const schema = [
  `

  enum EventNS {
    TRANSACTIONS
  }

  enum EventType {
    NEW_SALE
  }

  # Queries

  input TimelineQuery {
    ns: EventNS
    types: [EventType!]
  }

  type TimelineResponse {
    result: [Event!]!
    prevCursor: Date
    cursor: Date
  }

  # ------------------------------------
  # Event type
  # ------------------------------------
  type Event {
    id: ID!

    timestamp: Date!

    ns: EventNS!

    type: EventType!
    metadata: JSON!

    user: User
  }

  type NewEventResponse {
    event: Event!
  }

`,
];

export const resolvers = {
  Event: objectAssign(
    {},
    {
      user(event, {}, context) {
        return context.Users.get(event.userId);
      },
    },
    graphqlResolvers(['metadata', 'id', 'ns', 'type', 'timestamp']),
  ),

  Mutation: {},

  Query: {
    timeline(obj, { cursor, query }, context) {
      return context.Events.getTimeline({ cursor, query });
    },
  },
};
