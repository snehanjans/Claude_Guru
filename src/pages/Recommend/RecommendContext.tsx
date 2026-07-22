import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AmbassadorReferral, AmbassadorWebinar, WebinarStatus } from "@/lib/types";
import { toYmd } from "@/lib/helpers";
import { demoAmbassadorReferrals } from "@/data/demo-ambassador";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addWebinar as addWebinarAction,
  setWebinarStatus as setWebinarStatusAction,
} from "@/store/slices/webinarsSlice";

export type RecommendTab =
  | "programs"
  | "referrals"
  | "announcements"
  | "broadcast";

export interface RecommendContextValue {
  referrals: AmbassadorReferral[];
  addReferral: (input: { learner: string; programId: string }) => void;
  highlightId: string | null;
  activeTab: RecommendTab;
  setActiveTab: (tab: RecommendTab) => void;
  openFlow: (programId?: string) => void;
  closeFlow: () => void;
  flowOpen: boolean;
  flowProgramId: string | null;
  webinars: AmbassadorWebinar[];
  addWebinar: (input: {
    programId: string;
    title: string;
    dateYmd: string;
    start: number;
    end: number;
    description?: string;
    status: "draft" | "scheduled";
  }) => void;
  setWebinarStatus: (id: string, status: WebinarStatus) => void;
  highlightWebinarId: string | null;
}

const RecommendCtx = createContext<RecommendContextValue | null>(null);

export function RecommendProvider({ children }: { children: ReactNode }) {
  const [referrals, setReferrals] = useState<AmbassadorReferral[]>(
    () => [...demoAmbassadorReferrals],
  );
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<RecommendTab>("programs");
  const [flowOpen, setFlowOpen] = useState(false);
  const [flowProgramId, setFlowProgramId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const webinars = useAppSelector((s) => s.webinars.items);
  const [highlightWebinarId, setHighlightWebinarId] = useState<string | null>(null);

  const addReferral = useCallback((input: { learner: string; programId: string }) => {
    const id = `ref-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const referral: AmbassadorReferral = {
      id,
      learner: input.learner,
      programId: input.programId,
      dateYmd: toYmd(new Date()),
      status: "sent",
      // Currency + final bonus resolve once the learner pays (by their geography).
      currency: "USD",
      reward: 0,
    };
    setReferrals((prev) => [referral, ...prev]);
    setHighlightId(id);
    setActiveTab("referrals");
  }, []);

  const addWebinar = useCallback(
    (input: {
      programId: string;
      title: string;
      dateYmd: string;
      start: number;
      end: number;
      description?: string;
      status: "draft" | "scheduled";
    }) => {
      const id = `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const webinar: AmbassadorWebinar = {
        id,
        programId: input.programId,
        title: input.title,
        dateYmd: input.dateYmd,
        start: input.start,
        end: input.end,
        description: input.description,
        status: input.status,
        registered: 0,
      };
      dispatch(addWebinarAction(webinar));
      setHighlightWebinarId(id);
    },
    [dispatch],
  );

  const setWebinarStatus = useCallback(
    (id: string, status: WebinarStatus) => {
      dispatch(setWebinarStatusAction({ id, status }));
    },
    [dispatch],
  );

  const openFlow = useCallback((programId?: string) => {
    setFlowProgramId(programId ?? null);
    setFlowOpen(true);
  }, []);

  const closeFlow = useCallback(() => {
    setFlowOpen(false);
  }, []);

  const value = useMemo<RecommendContextValue>(
    () => ({
      referrals,
      addReferral,
      highlightId,
      activeTab,
      setActiveTab,
      openFlow,
      closeFlow,
      flowOpen,
      flowProgramId,
      webinars,
      addWebinar,
      setWebinarStatus,
      highlightWebinarId,
    }),
    [
      referrals,
      addReferral,
      highlightId,
      activeTab,
      openFlow,
      closeFlow,
      flowOpen,
      flowProgramId,
      webinars,
      addWebinar,
      setWebinarStatus,
      highlightWebinarId,
    ],
  );

  return <RecommendCtx.Provider value={value}>{children}</RecommendCtx.Provider>;
}

export function useRecommend(): RecommendContextValue {
  const ctx = useContext(RecommendCtx);
  if (!ctx) {
    throw new Error("useRecommend must be used within a RecommendProvider");
  }
  return ctx;
}
