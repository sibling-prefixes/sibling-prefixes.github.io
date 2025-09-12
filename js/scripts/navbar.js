const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const collapseElement = document.querySelector('.navbar-collapse');
        if (collapseElement) {
            const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement);
            bsCollapse.hide();
        }
    });
});