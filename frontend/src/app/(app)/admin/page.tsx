"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Mail,
  Plus,
  ReceiptText,
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

type TabKey = "users" | "transactions";

const tabs: { key: TabKey; label: string; icon: typeof Users }[] = [
  { key: "users", label: "Users", icon: Users },
  { key: "transactions", label: "Transactions", icon: ReceiptText },
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("users");
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

  const pendingCount = useMemo(
    () => transactions.filter((transaction) => transaction.status === "pending").length,
    [transactions],
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

  const activeError = activeTab === "users" ? usersError : transactionsError;
  const activeLoading = activeTab === "users" ? usersLoading : transactionsLoading;

  return (
    <div className="relative space-y-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Operations</p>
          <h1 className="mt-3 text-5xl font-black text-slate-950">Admin</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-96">
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
        ) : (
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
        )}
      </section>

      <button
        type="button"
        onClick={openNewUserPanel}
        className="fixed bottom-24 right-6 z-20 flex h-14 w-14 items-center justify-center bg-primary text-white shadow-2xl shadow-primary/30 transition-transform hover:scale-105 md:bottom-8 md:right-8"
        aria-label="Add user"
      >
        <Plus className="h-7 w-7" />
      </button>

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
