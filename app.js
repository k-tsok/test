const STORAGE_KEY = "simple-memo-items";

const form = document.getElementById("memo-form");
const input = document.getElementById("memo-input");
const list = document.getElementById("memo-list");
const template = document.getElementById("memo-item-template");

let memos = loadMemos();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  memos.unshift({
    id: crypto.randomUUID(),
    text,
  });

  input.value = "";
  saveMemos();
  render();
});

function render() {
  list.innerHTML = "";

  if (memos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "メモはまだありません。";
    list.appendChild(empty);
    return;
  }

  for (const memo of memos) {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector(".memo-item");
    const text = fragment.querySelector(".memo-text");
    const editBtn = fragment.querySelector(".edit-btn");
    const deleteBtn = fragment.querySelector(".delete-btn");

    text.textContent = memo.text;

    editBtn.addEventListener("click", () => {
      const next = prompt("メモを編集", memo.text);
      if (next === null) return;

      const cleaned = next.trim();
      if (!cleaned) {
        alert("空のメモにはできません。");
        return;
      }

      memo.text = cleaned;
      saveMemos();
      render();
    });

    deleteBtn.addEventListener("click", () => {
      memos = memos.filter((m) => m.id !== memo.id);
      saveMemos();
      render();
    });

    item.dataset.id = memo.id;
    list.appendChild(fragment);
  }
}

function saveMemos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
    return true;
  } catch {
    alert("保存に失敗しました。ブラウザの保存設定を確認してください。");
    return false;
  }
}

function loadMemos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((m) => m && typeof m.id === "string" && typeof m.text === "string")
      .map((m) => ({ id: m.id, text: m.text }));
  } catch {
    return [];
  }
}
