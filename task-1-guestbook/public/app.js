"use strict";
/// <reference lib="dom" />
const $ = (sel) => document.querySelector(sel);
const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
async function loadEntries() {
    const res = await fetch("/entries");
    const data = (await res.json());
    render(data);
}
async function addEntry(name, msg) {
    const res = await fetch("/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, msg }),
    });
    if (!res.ok) {
        // 'unknown' sicher behandeln
        let message = "Error: CAN NOT SAVE";
        try {
            const err = (await res.json());
            if (typeof err?.error === "string")
                message = err.error;
        }
        catch { }
        alert(message);
        return;
    }
    await loadEntries();
}
function render(entries) {
    const list = $("#gb-list");
    list.innerHTML = "";
    for (const entry of entries) {
        const li = document.createElement("li");
        const header = document.createElement('header');
        const nameEl = document.createElement('strong');
        nameEl.textContent = entry.name;
        const dateEl = document.createElement('small');
        const dt = new Date(entry.time).toLocaleString();
        dateEl.textContent = ` ${dt}`;
        header.appendChild(nameEl);
        header.appendChild(dateEl);
        const msg = document.createElement('p');
        msg.innerHTML = escapeHtml(entry.msg).replace(/\n/g, '<br/>');
        li.appendChild(header);
        li.appendChild(msg);
        list.appendChild(li);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const form = $("#gb-form");
    const name = $("#name");
    const msg = $("#msg");
    form.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const n = name.value.trim();
        const m = msg.value.trim();
        if (!n || !m)
            return;
        await addEntry(n, m);
        form.reset();
        name.focus();
    });
    loadEntries();
});
//# sourceMappingURL=app.js.map