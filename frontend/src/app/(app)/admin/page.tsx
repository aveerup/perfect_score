"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ClipboardCheck,
  Loader2,
  Mail,
  Mic,
  PenLine,
  Plus,
  ReceiptText,
  Save,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { api, useApiData } from "@/lib/api";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
  currentBand: number;
  targetBand: number;
  createdAt: string;
  updatedAt: string;
};

type AdminTransaction = {
  id: string;
  email: string;
  transactionId: string;
  planName: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
};

type SpeakingAudioMarks = {
  followsModelAnswer: boolean;
  goodPronunciation: boolean;
  speakingFluidity: boolean;
};

type SpeakingRawScore = {
  mcqEarned?: number;
  mcqTotal?: number;
  audioEarned?: number | null;
  audioTotal?: number;
  earned?: number;
  total?: number;
};

type SpeakingEvaluationSummary = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  practiseSet: number;
  title: string;
  submittedAt: string;
  score: number | null;
  rawScore?: SpeakingRawScore;
  evaluationStatus: "pending_audio_review" | "evaluated" | string;
};

type SpeakingQuestionEvaluation = {
  type: "mcq" | "audio";
  score: number | null;
  maxScore: number;
  isCorrect?: boolean;
  correctAnswer?: string;
  marks?: SpeakingAudioMarks;
};

type SpeakingEvaluationQuestion = {
  id: string;
  number: number;
  label?: string;
  prompt: string;
  type: string;
  options?: string[];
  title?: string;
  theme?: string;
  rules?: string[];
  answer?: string;
  modelAnswer?: string;
  submittedAnswer?: string;
  audioPath?: string;
  audioUrl?: string | null;
  evaluation?: SpeakingQuestionEvaluation;
};

type SpeakingEvaluationDetail = SpeakingEvaluationSummary & {
  practiceId: string;
  instructions?: string | null;
  answers: Record<string, string>;
  audioPaths: Record<string, string>;
  result?: {
    rawScore?: SpeakingRawScore;
    evaluation?: {
      status?: string;
      questionScores?: Record<string, SpeakingQuestionEvaluation>;
    };
  };
  questions: SpeakingEvaluationQuestion[];
};

type TabKey = "users" | "transactions" | "evaluations";
type EvaluationSkill = "speaking" | "writing";

const tabs: { key: TabKey; label: string; icon: typeof Users }[] = [
  { key: "users", label: "Users", icon: Users },
  { key: "transactions", label: "Transactions", icon: ReceiptText },
  { key: "evaluations", label: "Evaluation", icon: ClipboardCheck },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function statusClass(status: AdminTransaction["status"]) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (status === "rejected") return "bg-red-50 text-red-700 border-red-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
}

function evaluationStatusClass(status: string) {
  if (status === "evaluated") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
}

function emptyAudioMarks(): SpeakingAudioMarks {
  return {
    followsModelAnswer: false,
    goodPronunciation: false,
    speakingFluidity: false,
  };
}

function audioMarksScore(marks: SpeakingAudioMarks) {
  return (marks.followsModelAnswer ? 2 : 0) + (marks.goodPronunciation ? 1 : 0) + (marks.speakingFluidity ? 1 : 0);
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [evaluationSkill, setEvaluationSkill] = useState<EvaluationSkill>("speaking");
  const [selectedSpeakingAttempt, setSelectedSpeakingAttempt] = useState<SpeakingEvaluationDetail | null>(null);
  const [speakingDetailLoading, setSpeakingDetailLoading] = useState(false);
  const [speakingEvaluationSaving, setSpeakingEvaluationSaving] = useState(false);
  const [speakingEvaluationError, setSpeakingEvaluationError] = useState("");
  const [audioMarks, setAudioMarks] = useState<Record<string, SpeakingAudioMarks>>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const {
    data: users,
    setData: setUsers,
    loading: usersLoading,
    error: usersError,
  } = useApiData<AdminUser[]>("/admin/users", []);
  const {
    data: transactions,
    setData: setTransactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useApiData<AdminTransaction[]>("/admin/transactions", []);
  const {
    data: speakingAttempts,
    setData: setSpeakingAttempts,
    loading: speakingAttemptsLoading,
    error: speakingAttemptsError,
  } = useApiData<SpeakingEvaluationSummary[]>("/admin/evaluations/speaking", []);

  const pendingCount = useMemo(
    () => transactions.filter((transaction) => transaction.status === "pending").length,
    [transactions],
  );
  const pendingEvaluationCount = useMemo(
    () => speakingAttempts.filter((attempt) => attempt.evaluationStatus !== "evaluated").length,
    [speakingAttempts],
  );

  const resetForm = () => {
    setSelectedTransaction(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFormError("");
    setFormLoading(false);
  };

  const openNewUserPanel = () => {
    resetForm();
    setPanelOpen(true);
  };

  const openTransactionUserPanel = (transaction: AdminTransaction) => {
    resetForm();
    setSelectedTransaction(transaction);
    setEmail(transaction.email);
    setActiveTab("users");
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    resetForm();
  };

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormLoading(true);
    try {
      const response = await api.post<{ user: AdminUser; transaction?: AdminTransaction | null }>("/admin/users", {
        email,
        password,
        transactionId: selectedTransaction?.id,
      });
      setUsers((current) => [response.user, ...current.filter((user) => user.id !== response.user.id)]);
      if (response.transaction) {
        const approvedTransaction = response.transaction;
        setTransactions((current) =>
          current.map((transaction) =>
            transaction.id === approvedTransaction.id ? approvedTransaction : transaction,
          ),
        );
      }
      closePanel();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create user.");
    } finally {
      setFormLoading(false);
    }
  };

  const openSpeakingAttempt = async (attemptId: string) => {
    setSpeakingDetailLoading(true);
    setSpeakingEvaluationError("");
    try {
      const detail = await api.get<SpeakingEvaluationDetail>(`/admin/evaluations/speaking/${attemptId}`);
      const nextMarks: Record<string, SpeakingAudioMarks> = {};
      detail.questions.forEach((question) => {
        if (!question.options?.length) {
          nextMarks[question.id] = {
            ...emptyAudioMarks(),
            ...(question.evaluation?.marks ?? {}),
          };
        }
      });
      setSelectedSpeakingAttempt(detail);
      setAudioMarks(nextMarks);
    } catch (error) {
      setSpeakingEvaluationError(error instanceof Error ? error.message : "Unable to load speaking attempt.");
    } finally {
      setSpeakingDetailLoading(false);
    }
  };

  const setAudioMark = (questionId: string, key: keyof SpeakingAudioMarks, value: boolean) => {
    setAudioMarks((current) => ({
      ...current,
      [questionId]: {
        ...(current[questionId] ?? emptyAudioMarks()),
        [key]: value,
      },
    }));
  };

  const saveSpeakingEvaluation = async () => {
    if (!selectedSpeakingAttempt) return;
    setSpeakingEvaluationSaving(true);
    setSpeakingEvaluationError("");
    try {
      const detail = await api.patch<SpeakingEvaluationDetail>(
        `/admin/evaluations/speaking/${selectedSpeakingAttempt.id}`,
        { audioMarks },
      );
      const resultRawScore = detail.result?.rawScore;
      setSpeakingAttempts((current) =>
        current.map((attempt) =>
          attempt.id === detail.id
            ? {
                ...attempt,
                score: resultRawScore?.earned ?? attempt.score,
                rawScore: resultRawScore,
                evaluationStatus: detail.result?.evaluation?.status ?? "evaluated",
              }
            : attempt,
        ),
      );
      setSelectedSpeakingAttempt(null);
      setAudioMarks({});
    } catch (error) {
      setSpeakingEvaluationError(error instanceof Error ? error.message : "Unable to save evaluation.");
    } finally {
      setSpeakingEvaluationSaving(false);
    }
  };

  const activeError =
    activeTab === "users"
      ? usersError
      : activeTab === "transactions"
        ? transactionsError
        : speakingAttemptsError;
  const activeLoading =
    activeTab === "users"
      ? usersLoading
      : activeTab === "transactions"
        ? transactionsLoading
        : speakingAttemptsLoading;

  return (
    <div className="relative space-y-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Operations</p>
          <h1 className="mt-3 text-5xl font-black text-slate-950">Admin</h1>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:w-[34rem]">
          <div className="border border-slate-100 bg-white p-5">
            <Users className="h-5 w-5 text-primary" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Users</p>
            <p className="text-2xl font-black text-slate-950">{users.length}</p>
          </div>
          <div className="border border-slate-100 bg-white p-5">
            <ReceiptText className="h-5 w-5 text-primary" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Pending</p>
            <p className="text-2xl font-black text-slate-950">{pendingCount}</p>
          </div>
          <div className="border border-slate-100 bg-white p-5">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Review</p>
            <p className="text-2xl font-black text-slate-950">{pendingEvaluationCount}</p>
          </div>
        </div>
      </header>

      <section className="border border-slate-100 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex h-11 items-center gap-2 px-4 text-sm font-black transition-colors ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {activeLoading ? (
          <div className="flex min-h-80 items-center justify-center text-sm font-bold text-slate-400">
            Loading admin data...
          </div>
        ) : activeError ? (
          <div className="flex min-h-80 items-center justify-center px-6 text-center text-sm font-bold text-red-500">
            {activeError}
          </div>
        ) : activeTab === "users" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Current</th>
                  <th className="px-5 py-4">Target</th>
                  <th className="px-5 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-xs font-black text-primary">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-950">{user.name}</p>
                          <p className="text-xs font-bold text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-black uppercase text-slate-600">
                        {user.role === "admin" && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black text-slate-700">{user.currentBand.toFixed(1)}</td>
                    <td className="px-5 py-4 font-black text-slate-700">{user.targetBand.toFixed(1)}</td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-400">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "transactions" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Transaction</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="text-sm">
                    <td className="px-5 py-4 font-bold text-slate-700">{transaction.email}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {transaction.transactionId}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700">{transaction.planName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex border px-2.5 py-1 text-xs font-black uppercase ${statusClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-400">{formatDate(transaction.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      {transaction.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => openTransactionUserPanel(transaction)}
                          className="inline-flex h-9 items-center gap-2 bg-slate-950 px-3 text-xs font-black text-white transition-colors hover:bg-primary disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                      ) : (
                        <span className="text-xs font-black uppercase text-slate-300">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EvaluationPanel
            skill={evaluationSkill}
            onSkillChange={setEvaluationSkill}
            attempts={speakingAttempts}
            selectedAttempt={selectedSpeakingAttempt}
            detailLoading={speakingDetailLoading}
            saving={speakingEvaluationSaving}
            error={speakingEvaluationError}
            audioMarks={audioMarks}
            onOpenAttempt={openSpeakingAttempt}
            onBack={() => {
              setSelectedSpeakingAttempt(null);
              setSpeakingEvaluationError("");
            }}
            onSetAudioMark={setAudioMark}
            onSave={saveSpeakingEvaluation}
          />
        )}
      </section>

      {activeTab === "users" && (
        <button
          type="button"
          onClick={openNewUserPanel}
          className="fixed bottom-24 right-6 z-20 flex h-14 w-14 items-center justify-center bg-primary text-white shadow-2xl shadow-primary/30 transition-transform hover:scale-105 md:bottom-8 md:right-8"
          aria-label="Add user"
        >
          <Plus className="h-7 w-7" />
        </button>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-end bg-slate-950/30 p-4 backdrop-blur-sm md:p-8">
          <form
            onSubmit={handleCreateUser}
            className="w-full max-w-md border border-slate-100 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">New user</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Add Student</h2>
                {selectedTransaction && (
                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {selectedTransaction.planName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="flex h-10 w-10 items-center justify-center bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Email</span>
                <div className="mt-2 flex items-center gap-3 border border-slate-200 bg-white px-4">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    readOnly={Boolean(selectedTransaction)}
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm font-bold outline-none read-only:cursor-not-allowed read-only:text-slate-500"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 h-12 w-full border border-slate-200 px-4 text-sm font-bold outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Confirm Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 h-12 w-full border border-slate-200 px-4 text-sm font-bold outline-none focus:border-primary"
                />
              </label>
            </div>

            {formError && <p className="mt-4 text-sm font-bold text-red-500">{formError}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closePanel}
                className="h-11 bg-slate-50 px-5 text-sm font-black text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="flex h-11 items-center gap-2 bg-primary px-5 text-sm font-black text-white transition-colors hover:bg-slate-950 disabled:opacity-50"
              >
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Set
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function EvaluationPanel({
  skill,
  onSkillChange,
  attempts,
  selectedAttempt,
  detailLoading,
  saving,
  error,
  audioMarks,
  onOpenAttempt,
  onBack,
  onSetAudioMark,
  onSave,
}: {
  skill: EvaluationSkill;
  onSkillChange: (skill: EvaluationSkill) => void;
  attempts: SpeakingEvaluationSummary[];
  selectedAttempt: SpeakingEvaluationDetail | null;
  detailLoading: boolean;
  saving: boolean;
  error: string;
  audioMarks: Record<string, SpeakingAudioMarks>;
  onOpenAttempt: (attemptId: string) => void;
  onBack: () => void;
  onSetAudioMark: (questionId: string, key: keyof SpeakingAudioMarks, value: boolean) => void;
  onSave: () => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {([
            { key: "speaking", label: "Speaking", icon: Mic },
            { key: "writing", label: "Writing", icon: PenLine },
          ] as const).map(({ key, label, icon: Icon }) => {
            const isActive = skill === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSkillChange(key)}
                className={`flex h-10 items-center gap-2 px-4 text-xs font-black uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {skill === "writing" ? (
        <div className="flex min-h-96 items-center justify-center p-8 text-center">
          <div>
            <PenLine className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-5 text-sm font-black uppercase tracking-widest text-slate-400">Work going on</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Writing evaluation is coming later.</h2>
          </div>
        </div>
      ) : selectedAttempt ? (
        <SpeakingAttemptDetail
          attempt={selectedAttempt}
          loading={detailLoading}
          saving={saving}
          error={error}
          audioMarks={audioMarks}
          onBack={onBack}
          onSetAudioMark={onSetAudioMark}
          onSave={onSave}
        />
      ) : (
        <SpeakingAttemptsList
          attempts={attempts}
          loading={detailLoading}
          error={error}
          onOpenAttempt={onOpenAttempt}
        />
      )}
    </div>
  );
}

function SpeakingAttemptsList({
  attempts,
  loading,
  error,
  onOpenAttempt,
}: {
  attempts: SpeakingEvaluationSummary[];
  loading: boolean;
  error: string;
  onOpenAttempt: (attemptId: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm font-bold text-slate-400">
        Loading speaking attempt...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-sm font-bold text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left">
        <thead className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400">
          <tr>
            <th className="px-5 py-4">Student</th>
            <th className="px-5 py-4">Test</th>
            <th className="px-5 py-4">Submitted</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Score</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {attempts.map((attempt) => (
            <tr key={attempt.id} className="text-sm">
              <td className="px-5 py-4">
                <p className="font-black text-slate-950">{attempt.userName}</p>
                <p className="text-xs font-bold text-slate-400">{attempt.userEmail}</p>
              </td>
              <td className="px-5 py-4">
                <p className="font-bold text-slate-700">{attempt.title}</p>
                <p className="text-xs font-bold text-slate-400">Set {attempt.practiseSet}</p>
              </td>
              <td className="px-5 py-4 text-xs font-bold text-slate-400">{formatDate(attempt.submittedAt)}</td>
              <td className="px-5 py-4">
                <span className={`inline-flex border px-2.5 py-1 text-xs font-black uppercase ${evaluationStatusClass(attempt.evaluationStatus)}`}>
                  {attempt.evaluationStatus === "evaluated" ? "Evaluated" : "Pending"}
                </span>
              </td>
              <td className="px-5 py-4 font-black text-slate-700">
                {attempt.rawScore?.earned !== undefined && attempt.rawScore?.total !== undefined
                  ? `${attempt.rawScore.earned}/${attempt.rawScore.total}`
                  : "Pending"}
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onOpenAttempt(attempt.id)}
                  className="inline-flex h-9 items-center gap-2 bg-slate-950 px-3 text-xs font-black text-white transition-colors hover:bg-primary"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Open
                </button>
              </td>
            </tr>
          ))}
          {!attempts.length && (
            <tr>
              <td colSpan={6} className="px-5 py-14 text-center text-sm font-bold text-slate-400">
                No submitted speaking attempts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SpeakingAttemptDetail({
  attempt,
  loading,
  saving,
  error,
  audioMarks,
  onBack,
  onSetAudioMark,
  onSave,
}: {
  attempt: SpeakingEvaluationDetail;
  loading: boolean;
  saving: boolean;
  error: string;
  audioMarks: Record<string, SpeakingAudioMarks>;
  onBack: () => void;
  onSetAudioMark: (questionId: string, key: keyof SpeakingAudioMarks, value: boolean) => void;
  onSave: () => void;
}) {
  const mcqEarned = attempt.result?.rawScore?.mcqEarned ?? 0;
  const mcqTotal = attempt.result?.rawScore?.mcqTotal ?? 0;
  const audioEarned = Object.values(audioMarks).reduce((total, marks) => total + audioMarksScore(marks), 0);
  const audioTotal = attempt.questions.filter((question) => !question.options?.length).length * 4;
  const earned = mcqEarned + audioEarned;
  const total = mcqTotal + audioTotal;

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm font-bold text-slate-400">
        Loading speaking attempt...
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex h-9 items-center gap-2 bg-slate-50 px-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">{attempt.userEmail}</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{attempt.title}</h2>
          <p className="mt-2 text-sm font-bold text-slate-500">Submitted {formatDate(attempt.submittedAt)}</p>
        </div>
        <div className="border border-slate-100 bg-slate-50 p-5 text-right">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Current total</p>
          <p className="text-3xl font-black text-slate-950">{earned}/{total}</p>
          <p className="mt-1 text-xs font-bold text-slate-400">MCQ {mcqEarned}/{mcqTotal} · Audio {audioEarned}/{audioTotal}</p>
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-bold text-red-500">{error}</p>}

      <div className="mt-6 space-y-5">
        {attempt.questions.map((question) =>
          question.options?.length ? (
            <McqEvaluationCard key={question.id} question={question} />
          ) : (
            <AudioEvaluationCard
              key={question.id}
              question={question}
              marks={audioMarks[question.id] ?? emptyAudioMarks()}
              onSetAudioMark={onSetAudioMark}
            />
          ),
        )}
      </div>

      <div className="sticky bottom-0 mt-6 flex justify-end border-t border-slate-100 bg-white/95 py-4 backdrop-blur">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-black text-white transition-colors hover:bg-slate-950 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Done
        </button>
      </div>
    </div>
  );
}

function McqEvaluationCard({ question }: { question: SpeakingEvaluationQuestion }) {
  return (
    <article className="grid gap-4 border border-slate-100 bg-white p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Question {question.label ?? question.number}</p>
        <h3 className="mt-2 text-lg font-black text-slate-950">{question.prompt}</h3>
        <div className="mt-4 grid gap-2">
          {question.options?.map((option) => (
            <div
              key={option}
              className={`border px-3 py-2 text-sm font-bold ${
                option === question.submittedAnswer
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate-100 text-slate-500"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      <div className="border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Auto checked</p>
        <p className="mt-3 text-sm font-bold text-slate-600">Submitted: {question.submittedAnswer || "No answer"}</p>
        <p className="mt-2 text-sm font-bold text-slate-600">Correct: {question.answer || question.evaluation?.correctAnswer || "Not set"}</p>
        <p className="mt-4 text-2xl font-black text-slate-950">
          {question.evaluation?.score ?? 0}/{question.evaluation?.maxScore ?? 1}
        </p>
      </div>
    </article>
  );
}

function AudioEvaluationCard({
  question,
  marks,
  onSetAudioMark,
}: {
  question: SpeakingEvaluationQuestion;
  marks: SpeakingAudioMarks;
  onSetAudioMark: (questionId: string, key: keyof SpeakingAudioMarks, value: boolean) => void;
}) {
  return (
    <article className="border border-slate-100 bg-white p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Question {question.label ?? question.number}</p>
          {question.title && <p className="mt-3 text-xs font-black uppercase tracking-widest text-primary">{question.title}</p>}
          {question.theme && <p className="mt-2 text-sm font-bold text-slate-500">Theme: {question.theme}</p>}
          <h3 className="mt-3 text-xl font-black text-slate-950">{question.prompt}</h3>
          {question.modelAnswer && (
            <div className="mt-5 border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Model answer</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{question.modelAnswer}</p>
            </div>
          )}
        </div>
        <div className="border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Submitted audio</p>
          {question.audioUrl ? (
            <audio controls src={question.audioUrl} className="mt-4 w-full" />
          ) : (
            <p className="mt-4 text-sm font-bold text-red-500">Audio URL unavailable.</p>
          )}
          <p className="mt-4 break-all text-[11px] font-bold text-slate-400">{question.audioPath}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 md:grid-cols-3">
        <EvaluationCheckbox
          label="Follows model answer"
          marks="2 marks"
          checked={marks.followsModelAnswer}
          onChange={(checked) => onSetAudioMark(question.id, "followsModelAnswer", checked)}
        />
        <EvaluationCheckbox
          label="Good pronunciation"
          marks="1 mark"
          checked={marks.goodPronunciation}
          onChange={(checked) => onSetAudioMark(question.id, "goodPronunciation", checked)}
        />
        <EvaluationCheckbox
          label="Speaking fluidity"
          marks="1 mark"
          checked={marks.speakingFluidity}
          onChange={(checked) => onSetAudioMark(question.id, "speakingFluidity", checked)}
        />
      </div>
      <p className="mt-4 text-right text-lg font-black text-slate-950">{audioMarksScore(marks)}/4</p>
    </article>
  );
}

function EvaluationCheckbox({
  label,
  marks,
  checked,
  onChange,
}: {
  label: string;
  marks: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
      checked ? "border-primary bg-primary/5" : "border-slate-100 bg-white hover:border-slate-300"
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-primary"
      />
      <span>
        <span className="block text-sm font-black text-slate-950">{label}</span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-slate-400">{marks}</span>
      </span>
    </label>
  );
}
