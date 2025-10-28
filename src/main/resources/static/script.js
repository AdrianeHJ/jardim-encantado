document.addEventListener('DOMContentLoaded', function() {
    
    const modal = document.getElementById('auth-modal');
    const userIcon = document.getElementById('user-icon');
    const allViews = document.querySelectorAll('.modal-view');
    
    const viewLinks = document.querySelectorAll('[data-view]');
    
    const closeBtn = document.querySelector('.modal-close');

    /**
    @param {string} viewId
     */

    function showView(viewId) {
        if (allViews && allViews.length > 0) {
            allViews.forEach(view => {
                view.classList.remove('active');
            });
        }
        
        const activeView = document.getElementById(viewId);
        if (activeView) {
            activeView.classList.add('active');
        } else {
            console.error('Erro: View do modal com id "' + viewId + '" não foi encontrada.');
        }
    }
    
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            showView('login-view');
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    if (userIcon) {
        userIcon.addEventListener('click', openModal);
    } else {
        console.warn('Aviso: Elemento com id "user-icon" não foi encontrado.');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    } else {
        console.error('Erro: Elemento com classe "modal-close" não foi encontrado.');
    }

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) { 
                closeModal();
            }
        });
    }

    if (viewLinks && viewLinks.length > 0) {
        viewLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                
                
                const viewId = link.getAttribute('data-view');
                if (viewId) {
                    showView(viewId);
                }
            });
        });
    }

});