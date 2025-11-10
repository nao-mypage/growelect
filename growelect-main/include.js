async function includeHTML() {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
        const file = el.getAttribute('data-include');
        try {
            const res = await fetch(file);
            const html = await res.text();
            el.innerHTML = html;
        } catch (e) {
            console.error(`Error loading ${file}:`, e);
        }
    }
}

// include完了後に script.js を読み込む
document.addEventListener("DOMContentLoaded", async () => {
    await includeHTML();

    // header/footer 読み込みが終わったら script.js を動的に追加
    const script = document.createElement("script");
    script.src = "script.js";
    document.body.appendChild(script);
});