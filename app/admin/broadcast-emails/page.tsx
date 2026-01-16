"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BroadcastEmailsPage() {
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // TODO: Implement broadcast email functionality
    // This will be implemented later as per requirements
    setTimeout(() => {
      alert("Broadcast email functionality will be implemented soon.");
      setIsSending(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Broadcast Emails
        </h1>
        <p className="text-neutral-600">
          Send email updates to all subscribers (To be implemented)
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Compose Email
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Subject *
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Message *
                </label>
                <Textarea
                  rows={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  required
                />
                <p className="mt-1 text-xs text-neutral-500">
                  This message will be sent to all email subscribers
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSubject("");
                setMessage("");
              }}
            >
              Clear
            </Button>
            <Button type="submit" variant="primary" disabled={isSending}>
              {isSending ? "Sending..." : "Send Broadcast Email"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Information
            </h2>
            <div className="space-y-2 text-neutral-600">
              <p>
                <strong>Status:</strong> Feature to be implemented
              </p>
              <p>
                <strong>Functionality:</strong> This page will allow you to send
                broadcast emails to all subscribers who have subscribed via the
                homepage email subscription form.
              </p>
              <p>
                <strong>Note:</strong> Email subscription data is being collected
                and stored in the database. The broadcast functionality will be
                added in a future update.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
