// Update the anchor that points to data/latest/ to the current file.
document.addEventListener('DOMContentLoaded', function () {
    const anchor = document.querySelector('a[href^="data/latest/"]');
    if (!anchor) return;

    const dirUrl = 'data/latest/';

    function setLink(name) {
        if (!name) return;
        name = name.trim();
        if (!name) return;
        anchor.href = dirUrl + name;
    }

    fetch(dirUrl, { cache: 'no-store' })
        .then(r => { if (!r.ok) throw new Error('no dir'); return r.text(); })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const anchors = Array.from(doc.querySelectorAll('a'));
            let candidates = anchors
                .map(a => a.getAttribute('href') || '')
                .filter(h => /_edited\.csv$/i.test(h))
                .map(h => h.replace(/^\.\/|^\//, '')) 
                .filter(Boolean);
            console.log({candidates});

            if (!candidates.length) throw new Error('no candidates');

            // Prefer filenames with YYYYMMDD prefix, sort by date desc, else lexicographic desc
            candidates.sort((a, b) => {
                const da = (a.match(/^(\d{8})/) || [null, null])[1];
                const db = (b.match(/^(\d{8})/) || [null, null])[1];
                if (da && db) return db.localeCompare(da);
                if (da) return -1;
                if (db) return 1;
                return b.localeCompare(a);
            });

            setLink(candidates[0]);
        })
        .catch(err => {
            console.warn('Could not load manifest or directory listing:', err);
        });
});