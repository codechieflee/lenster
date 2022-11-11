import { Toggle } from '@components/UI/Toggle';
import type { FC } from 'react';

interface Props {
  on: boolean;
  setOn: (on: boolean) => void;
  label: string;
}

const ToggleWithHelper: FC<Props> = ({ on, setOn, label }) => (
  <div className="flex items-center space-x-2">
    <Toggle on={on} setOn={setOn} />
    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold">{label}</div>
  </div>
);

export default ToggleWithHelper;
