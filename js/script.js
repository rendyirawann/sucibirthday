document.addEventListener('DOMContentLoaded', () => {
    // --- [BARU] Logika untuk Membuat Animasi Kelopak Bunga ---
    const petalContainer = document.getElementById('petal-container');
    const numberOfPetals = 20; // Jumlah kelopak bunga yang diinginkan

    for (let i = 0; i < numberOfPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Atur properti acak untuk setiap kelopak bunga
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 5 + 5}s`; // Durasi antara 5-10 detik
        petal.style.animationDelay = `${Math.random() * 5}s`;
        petal.style.transform = `scale(${Math.random() * 0.5 + 0.5})`; // Ukuran acak
        petal.style.filter = `blur(${Math.random() * 1}px)`; // Sedikit blur acak

        petalContainer.appendChild(petal);
    }


    // --- Logika untuk Pintu Masuk ---
    const doorEntrance = document.getElementById('door-entrance');
    const mainContainer = document.querySelector('.main-container');
    const backgroundMusic = document.getElementById('background-music');

    doorEntrance.addEventListener('click', () => {
        backgroundMusic.play();
        doorEntrance.classList.add('opened');
        mainContainer.classList.add('visible');
        doorEntrance.classList.add('hidden');
        initializeMainMenu();
    }, { once: true }); // [BARU] { once: true } agar pintu hanya bisa diklik sekali


    // --- Logika Menu Utama (tidak berubah) ---
    function initializeMainMenu() {
        const navContainer = document.querySelector('.nav-container');
        const missionContainer = document.querySelector('.mission-container');
        const backButton = document.querySelector('.back-button');
        const menuItems = document.querySelectorAll('.menu-item');
        let activeIndex = 0;

        function setActiveItem(index) {
            menuItems.forEach(item => item.classList.remove('active'));
            menuItems[index].classList.add('active');
            activeIndex = index;
        }

        function handleAction(item) {
            const link = item.dataset.link;
            const action = item.dataset.item;

            if (action === 'mission') {
                mainContainer.classList.add('viewing-missions');
            } else if (link) {
                window.open(link, '_blank');
            }
        }

        document.addEventListener('keydown', (e) => {
            if (mainContainer.classList.contains('viewing-missions')) {
                if (e.key === 'Escape') {
                    backButton.click();
                }
                return;
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (activeIndex > 0) setActiveItem(activeIndex - 1);
                    break;
                case 'ArrowDown':
                    if (activeIndex < menuItems.length - 1) setActiveItem(activeIndex + 1);
                    break;
                case 'Enter':
                    handleAction(menuItems[activeIndex]);
                    break;
            }
        });

        menuItems.forEach((item, index) => {
            item.addEventListener('mouseover', () => {
                if (!mainContainer.classList.contains('viewing-missions')) {
                    setActiveItem(index);
                }
            });
            item.addEventListener('click', () => handleAction(item));
        });

        backButton.addEventListener('click', () => {
            mainContainer.classList.remove('viewing-missions');
        });

        setActiveItem(0);
    }
});