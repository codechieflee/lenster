import type { Publication } from '@lenster/lens';
import { create } from 'zustand';

interface GlobalModalState {
  showAuthModal: boolean;
  setShowAuthModal: (showAuthModal: boolean) => void;
  showNewPostModal: boolean;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  showReportModal: boolean;
  reportingPublication: Publication | null;
  reportConfig: any;
  setShowReportModal: (
    showReportModal: boolean,
    reportingPublication: Publication | null,
    reportConfig?: any
  ) => void;
  showStatusModal: boolean;
  setShowStatusModal: (showStatusModal: boolean) => void;
  showProfileSwitchModal: boolean;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  showMobileDrawer: boolean;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
  showInvitesModal: boolean;
  setShowInvitesModal: (showInvitesModal: boolean) => void;
}

export const useGlobalModalStateStore = create<GlobalModalState>((set) => ({
  showAuthModal: false,
  setShowAuthModal: (showAuthModal) => set(() => ({ showAuthModal })),
  showNewPostModal: false,
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  showReportModal: false,
  reportingPublication: null,
  reportConfig: null,
  setShowReportModal: (showReportModal, reportingPublication, reportConfig) =>
    set(() => ({ showReportModal, reportingPublication, reportConfig })),
  showStatusModal: false,
  setShowStatusModal: (showStatusModal) => set(() => ({ showStatusModal })),
  showProfileSwitchModal: false,
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  showMobileDrawer: false,
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  showInvitesModal: false,
  setShowInvitesModal: (showInvitesModal) => set(() => ({ showInvitesModal }))
}));
