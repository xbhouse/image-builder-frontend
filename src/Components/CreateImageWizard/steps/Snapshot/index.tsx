import React from 'react';

import { Button, Form, Grid, Text, Title } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import Snapshot from './Snapshot';

import { CONTENT_URL } from '../../../../constants';

export default function SnapshotStep() {
  return (
    <Form>
      <Title headingLevel="h1" size="xl">
        Repeatable build
      </Title>
      <Grid>
        <Text>
          Control the consistency of the packages in the repository used to
          build the image.
        </Text>
        <Button
          component="a"
          target="_blank"
          variant="link"
          iconPosition="right"
          isInline
          icon={<ExternalLinkAltIcon />}
          href={CONTENT_URL}
        >
          Create and manage repositories here
        </Button>
      </Grid>
      <Snapshot />
    </Form>
  );
}
