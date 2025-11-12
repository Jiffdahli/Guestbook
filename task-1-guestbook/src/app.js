const $ = (sel) => document.querySelector(sel);
async function loadEntries() {
    const res = await fetch('/entries');
    const data = await res.json();
    render(data);
}
async function addEntry(name, msg) {
    const res = await fetch('/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, msg }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        alert(error.error ?? "Error: CAN NOT SAVE");
        return;
    }
    await loadEntries();
}
function render(entries) {
    const list = $('#gb-list');
    list.innerHTML = '';
    for (const entry of entries) {
        const li = document.createElement('li');
        const dt = new Date(entry.time).toLocaleString();
        li.innerHTML = `<strong>${entry.name}</strong> <small>(${dt})</small><br/>${entry.msg}`;
        list.appendChild(li);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const form = $('#gb-form');
    const name = $("#name");
    const msg = $("#msg");
    form.addEventListener('submit', async (ev) => {
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
export {};
//# sourceMappingURL=app.js.map