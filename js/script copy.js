document.addEventListener('DOMContentLoaded', () => {
    // --- Logika Animasi Kelopak Bunga ---
    const petalContainer = document.getElementById('petal-container');
    const numberOfPetals = 20;
    for (let i = 0; i < numberOfPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
        petal.style.animationDelay = `${Math.random() * 5}s`;
        petal.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        petal.style.filter = `blur(${Math.random() * 1}px)`;
        petalContainer.appendChild(petal);
    }

    // --- Logika Pintu Masuk ---
    const doorEntrance = document.getElementById('door-entrance');
    const mainContainer = document.querySelector('.main-container');
    const backgroundMusic = document.getElementById('background-music');

    doorEntrance.addEventListener('click', () => {
        backgroundMusic.play().catch(e => console.log("Autoplay was prevented."));
        doorEntrance.classList.add('opened');
        mainContainer.classList.add('visible');
        doorEntrance.classList.add('hidden');
        initializeMainMenu();
        initializeGridGallery(); // [DIUBAH] Panggil fungsi galeri grid yang baru
    }, { once: true });
    
    // --- [DIUBAH] Logika untuk Galeri Foto Grid ---
    function initializeGridGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        const totalImages = 48;

        // 1. Buat dan masukkan semua elemen gambar ke dalam kontainer
        for (let i = 1; i <= totalImages; i++) {
            const img = document.createElement('img');
            img.src = `img/gallery/${i}.jpeg`; // Pastikan path dan ekstensi file benar
            img.classList.add('gallery-item');
            galleryContainer.appendChild(img);
        }

        // 2. Animasikan kemunculan setiap gambar satu per satu
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
            }, index * 100); // Setiap gambar muncul dengan jeda 100 milidetik
        });
    }

    // --- Logika Menu Utama ---
    function initializeMainMenu() {
        // [DIUBAH] Variabel musik dipindahkan ke sini agar bisa diakses
        const music = document.getElementById('background-music');
        
        const cubeContainer = document.querySelector('.cube-container');
        const mediaPlayer = document.querySelector('.media-player-container');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const stopBtn = document.getElementById('stop-btn');
        const navContainer = document.querySelector('.nav-container');
        const missionContainer = document.querySelector('.mission-container');
        const backButton = document.querySelector('.back-button');
        const menuItems = document.querySelectorAll('.menu-item');
        let activeIndex = 0;
        
        // Cek status musik saat player pertama kali diinisialisasi
        if (music.paused) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

        // Event listener untuk kubus
        cubeContainer.addEventListener('click', () => {
            mediaPlayer.classList.toggle('show');
            // [BARU] Tambahkan efek pada kubus saat player muncul
            cubeContainer.classList.toggle('player-active');
        });

        // Event listener untuk tombol Play/Pause
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (music.paused) {
                music.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                music.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // Event listener untuk tombol Stop
        stopBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            music.pause();
            music.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

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