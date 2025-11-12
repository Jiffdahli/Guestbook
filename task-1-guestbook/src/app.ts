/// <reference lib="dom" />

type Entry = { id: string; name: string; msg: string; time: number };

const $ = <T extends HTMLElement>(sel: string) =>
  document.querySelector(sel) as T;

async function loadEntries() {
  const res = await fetch("/entries");
  const data = (await res.json()) as Entry[];
  render(data);
}

async function addEntry(name: string, msg: string) {
  const res = await fetch("/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, msg }),
  });

  if (!res.ok) {
    // 'unknown' sicher behandeln
    let message = "Error: CAN NOT SAVE";
    try {
      const err = (await res.json()) as Record<string, unknown>;
      if (typeof err?.error === "string") message = err.error;
    } catch {}
    alert(message);
    return;
  }

  await loadEntries();
}

function render(entries: Entry[]) {
  const list = $("#gb-list");
  list.innerHTML = "";
  for (const entry of entries) {
    const li = document.createElement("li");
    const dt = new Date(entry.time).toLocaleString();
    li.innerHTML = `<strong>${entry.name}</strong> <small>(${dt})</small><br/>${entry.msg}`;
    list.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#gb-form") as HTMLFormElement;
  const name = $("#name") as HTMLInputElement;
  const msg  = $("#msg")  as HTMLTextAreaElement;

  form.addEventListener("submit", async (ev: SubmitEvent) => {
    ev.preventDefault();
    const n = name.value.trim();
    const m = msg.value.trim();
    if (!n || !m) return;
    await addEntry(n, m);
    form.reset();
    name.focus();
  });

  loadEntries();
});
