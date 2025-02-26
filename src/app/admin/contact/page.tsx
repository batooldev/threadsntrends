"use client";

import { useEffect, useState } from "react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data = await res.json();
        setContacts(data.contacts);
      } catch (err) {
        setError("Error fetching contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && contacts.length === 0 && <p>No contact messages found.</p>}

      {contacts.length > 0 && (
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="border">
                <td className="border p-2">{contact.name}</td>
                <td className="border p-2">{contact.email}</td>
                <td className="border p-2">{contact.subject}</td>
                <td className="border p-2">{contact.message}</td>
                <td className="border p-2">{new Date(contact.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
