import React, { useEffect, useState } from 'react';
import { Panel, Header, Typography, Stack, Button } from 'ui';
import { getPokemon } from '../../utils/api';

type Props = {
  selected: string[]; // pokemon ids
  onChange: (ids: string[]) => void;
};

export const PokemonSelector: React.FC<Props> = ({ selected, onChange }) => {
  const [all, setAll] = useState<any[]>([]);

  useEffect(() => {
    getPokemon().then((res) => setAll(res.data ?? []));
  }, []);

  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  return (
    <Panel background="surface" rounded={false}>
      <Stack background="pokemonPrimary" direction="column" spacing="4px" scroll="vertical" maxHeight={260} paddingTop={12}>
        <div style={{ padding: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {all.map((p) => {
            const isSelected = selected.includes(p.id);
            return (
              <Button
                key={p.id}
                onClick={() => toggle(p.id)}
                background={isSelected ? 'accent' : 'pokemonTertiary'}
                type="button"
              >
                {p.name}
              </Button>
            );
          })}
        </div>
      </Stack>
    </Panel>
  );
};