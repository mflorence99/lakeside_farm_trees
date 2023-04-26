import { AppProps } from '../app';

import { createTree } from '../actions';
import { forHTMLDatetime } from '../helpers';
import { getRecordById } from '../actions';

import { Box } from '@airtable/blocks/ui';
import { Button } from '@airtable/blocks/ui';
import { FormField } from '@airtable/blocks/ui';
import { Heading } from '@airtable/blocks/ui';
import { Loader } from '@airtable/blocks/ui';
import { Select } from '@airtable/blocks/ui';

import { expandRecord } from '@airtable/blocks/ui';
import { useState } from 'react';

import React from 'react';

export default function CreateTree({ ctx, data }: AppProps): JSX.Element {
  // 👇 prepare the form
  const [form, setForm] = useState({
    date: forHTMLDatetime(new Date()),
    speciesId: null,
    working: false
  });
  const dfltSpecies = { label: 'Pick one', value: null };
  const stageId = data.stageIdBySymbol.STANDING;
  // 👇 when OK is clicked
  const ok = async (): Promise<void> => {
    setForm({ ...form, working: true });
    const treeId = await createTree({
      date: form.date,
      history: ctx.HISTORY,
      speciesId: form.speciesId,
      stageId,
      trees: ctx.TREES
    });
    expandRecord(
      await getRecordById({
        recordId: treeId,
        table: ctx.TREES
      })
    );
    setForm({ ...form, working: false });
  };
  // 👇 build the form
  return (
    <Box className="divided-box">
      <Heading>Identify standing tree</Heading>

      <Box display="flex" justifyContent="space-between">
        <FormField label="Species" width="33%">
          <Select
            onChange={(v: string): void => setForm({ ...form, speciesId: v })}
            options={[dfltSpecies, ...data.speciesOptions]}
            value={form.speciesId}
          />
        </FormField>
        <FormField label="When identified" width="auto">
          <input
            className="datetime-input"
            onChange={(e): void => setForm({ ...form, date: e.target.value })}
            type="datetime-local"
            value={form.date}
          />
        </FormField>
        {form.working ? (
          <Loader alignSelf="center" className="spinner" scale={0.3} />
        ) : (
          <Button
            alignSelf="center"
            className="ok-button"
            disabled={!form.speciesId}
            onClick={ok}
            variant="primary"
          >
            OK
          </Button>
        )}
      </Box>
    </Box>
  );
}
