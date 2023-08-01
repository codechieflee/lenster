import { Menu } from '@headlessui/react';
import { ShieldExclamationIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import clsx from 'clsx';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface ReportProps {
  publication: Publication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const setShowPublicationReportModal = useGlobalModalStateStore(
    (state) => state.setShowPublicationReportModal
  );

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm text-red-500'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPublicationReportModal(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <ShieldExclamationIcon className="h-4 w-4" />
        <div>Report Post</div>
      </div>
    </Menu.Item>
  );
};

export default Report;
