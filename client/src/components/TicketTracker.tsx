import React, { useState } from "react";
import { Search } from "lucide-react";
import { trackSupportTicket, errorMessage } from "../services/api";
import { FormError } from "./FormError";

/** Lets a student look up a ticket. Requires BOTH the ticket number and the email used (prevents ticket guessing). */
export default function TicketTracker() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicket(null);
    try {
      const res = await trackSupportTicket(ticketNumber.trim(), email.trim());
      setTicket(res.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E2EF2] mb-1">
        <Search className="w-3.5 h-3.5" />
        <span>Track Your Ticket</span>
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 text-xs mt-2">
        <input
          required
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          placeholder="Ticket number (MIC-XXXXXXXX)"
          className="px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2E2EF2]"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email used for the ticket"
          className="px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2E2EF2]"
        />
        <button disabled={loading} className="px-4 py-2.5 rounded-lg bg-[#2E2EF2] text-white font-bold disabled:opacity-70 cursor-pointer">
          {loading ? "Checking..." : "Track"}
        </button>
      </form>
      <div className="mt-3">
        <FormError message={error} />
      </div>
      {ticket && (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-700">
          <dt className="font-bold">Ticket</dt><dd>{ticket.ticketNumber}</dd>
          <dt className="font-bold">Status</dt><dd className="font-semibold text-[#2E2EF2]">{ticket.status}</dd>
          <dt className="font-bold">Priority</dt><dd>{ticket.priority}</dd>
          <dt className="font-bold">Category</dt><dd>{ticket.category || "-"}</dd>
          {ticket.responseNotes && (<><dt className="font-bold">Response</dt><dd className="col-span-1">{ticket.responseNotes}</dd></>)}
        </dl>
      )}
    </div>
  );
}
