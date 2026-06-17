"use client";

import { FormEvent, useState } from "react";
import { api, useApiData } from "@/lib/api";
import { AuthProfile } from "@/lib/types";

interface ProfileResponse {
  user: AuthProfile;
}

export default function ProfilePage() {
  const { data, setData, loading, error } = useApiData<ProfileResponse | null>("/profile", null);
  if (loading) return <div className="py-20 text-center text-slate-400">Loading profile...</div>;
  if (error || !data) return <div className="py-20 text-center text-red-500">{error || "Profile unavailable"}</div>;
  return <ProfileForm key={`${data.user.id}-${data.user.rowCreated}`} user={data.user} onSaved={(user) => setData({ user })} />;
}

function ProfileForm({ user, onSaved }: { user: AuthProfile; onSaved: (user: AuthProfile) => void }) {
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [timezone, setTimezone] = useState(user.timezone);
  const [targetBand, setTargetBand] = useState(user.targetBand);
  const [message, setMessage] = useState("");

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const updated = await api.patch<AuthProfile>("/me", { name, location, timezone, targetBand, targetScore: targetBand });
    onSaved(updated);
    setMessage("Profile saved.");
  };

  return (
    <div className="max-w-3xl space-y-8">
      <header><h1 className="text-5xl font-black">Your profile</h1><p className="text-slate-500 mt-2">{user.email} · Member since {user.joinDate}</p></header>
      <form onSubmit={save} className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-5">
        <Field label="Full name" value={name} onChange={setName} />
        <Field label="Location" value={location} onChange={setLocation} placeholder="Dhaka, Bangladesh" />
        <Field label="Timezone" value={timezone} onChange={setTimezone} placeholder="Asia/Dhaka" />
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Target band</span>
          <input type="number" min="5" max="9" step="0.5" value={targetBand} onChange={(event) => setTargetBand(Number(event.target.value))} className="mt-2 w-full h-12 border border-slate-200 rounded-xl px-4" />
        </label>
        {message && <p className="text-green-600 font-bold">{message}</p>}
        <button className="bg-primary text-white rounded-xl px-6 py-3 font-bold">Save profile</button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block"><span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full h-12 border border-slate-200 rounded-xl px-4" /></label>;
}
