import * as React from 'react';
import { IDocPageProps } from 'office-ui-fabric-react/lib/common/DocPage.types';
import { ActivityItemBasicExample } from './ActivityItem.Basic.Example';
import { ActivityItemPersonaExample } from './ActivityItem.Persona.Example';
import { ActivityItemCompactExample } from './ActivityItem.Compact.Example';

const ActivityItemBasicExampleCode = require('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/ActivityItem/ActivityItem.Basic.Example.tsx') as string;
const ActivityItemPersonaExampleCode = require('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/ActivityItem/ActivityItem.Persona.Example.tsx') as string;
const ActivityItemCompactExampleCode = require('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/ActivityItem/ActivityItem.Compact.Example.tsx') as string;

export const ActivityItemPageProps: IDocPageProps = {
  title: 'ActivityItem',
  componentName: 'ActivityItem',
  componentUrl:
    'https://github.com/microsoft/fluentui/tree/7.0/packages/office-ui-fabric-react/src/components/ActivityItem',
  examples: [
    {
      title: 'Activity Items with Icons',
      code: ActivityItemBasicExampleCode,
      view: <ActivityItemBasicExample />,
    },
    {
      title: 'Activity Items with Personas',
      code: ActivityItemPersonaExampleCode,
      view: <ActivityItemPersonaExample />,
    },
    {
      title: 'Compact Activity Items',
      code: ActivityItemCompactExampleCode,
      view: <ActivityItemCompactExample />,
    },
  ],
  overview: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/ActivityItem/docs/ActivityItemOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/ActivityItem/docs/ActivityItemBestPractices.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
};
