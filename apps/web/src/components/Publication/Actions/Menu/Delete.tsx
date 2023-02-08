import { Menu } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import clsx from 'clsx';
import type { Publication } from 'lens';
import { useHidePublicationMutation } from 'lens';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: Publication;
}

const Delete: FC<Props> = ({ publication }) => {
  const { pathname, push } = useRouter();
  const [hidePost] = useHidePublicationMutation({
    onCompleted: () => {
      Leafwatch.track(PUBLICATION.DELETE);
      pathname === '/posts/[id]' ? push('/') : location.reload();
    }
  });

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm text-red-500'
        )
      }
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete?')) {
          hidePost({
            variables: { request: { publicationId: publication?.id } }
          });
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="h-4 w-4" />
        <div>Delete</div>
      </div>
    </Menu.Item>
  );
};

export default Delete;
