import { PUBLICATION } from '@lenster/data/tracking';
import { useHidePublicationMutation } from '@lenster/lens';
import { publicationKeyFields } from '@lenster/lens/apollo/lib';
import { Alert } from '@lenster/ui';
import { PostHog } from '@lib/posthog';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/alerts';

const DeletePublication: FC = () => {
  const showPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.showPublicationDeleteAlert
  );
  const setShowPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.setShowPublicationDeleteAlert
  );
  const deletingPublication = useGlobalAlertStateStore(
    (state) => state.deletingPublication
  );

  const [hidePost, { loading }] = useHidePublicationMutation({
    onCompleted: () => {
      setShowPublicationDeleteAlert(false, null);
      PostHog.track(PUBLICATION.DELETE);
      toast.success(t`Publication deleted successfully`);
    },
    update: (cache) => {
      cache.evict({ id: publicationKeyFields(deletingPublication) });
    }
  });

  return (
    <Alert
      title={t`Delete Publication?`}
      description={t`This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.`}
      confirmText={t`Delete`}
      show={showPublicationDeleteAlert}
      isDestructive
      isPerformingAction={loading}
      onConfirm={() =>
        hidePost({
          variables: { request: { publicationId: deletingPublication?.id } }
        })
      }
      onClose={() => setShowPublicationDeleteAlert(false, null)}
    />
  );
};

export default DeletePublication;
