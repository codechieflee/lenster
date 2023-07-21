import { Localstorage } from '@lenster/data/storage';

/**
 * Resets the auth data
 */
const resetAuthData = () => {
  localStorage.removeItem(Localstorage.AccessToken);
  localStorage.removeItem(Localstorage.RefreshToken);
  localStorage.removeItem(Localstorage.LensterStore);
  localStorage.removeItem(Localstorage.NotificationStore);
  localStorage.removeItem(Localstorage.TransactionStore);
  localStorage.removeItem(Localstorage.TimelineStore);
  localStorage.removeItem(Localstorage.MessageStore);
  localStorage.removeItem(Localstorage.AttachmentCache);
  localStorage.removeItem(Localstorage.AttachmentStore);
  localStorage.removeItem(Localstorage.FeaturesCache);
};

export default resetAuthData;
