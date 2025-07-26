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

// --- Elemen DOM Baru ---
const doorEntrance = document.getElementById('door-entrance');
const splashScreen = document.getElementById('splash-screen');
const countdownDisplay = document.getElementById('countdown');
const birthdayMessageDisplay = document.getElementById('birthday-message');
const gifContainer = document.getElementById('gif-container');
const mainContent = document.getElementById('main-content');
const backgroundMusic = document.getElementById('background-music');

doorEntrance.addEventListener('click', () => {
    doorEntrance.classList.add('opened');
    doorEntrance.classList.add('hidden');

                initializeMainMenu();
                            backgroundMusic.play().catch(e => console.log("Autoplay was prevented."));

    // Aktifkan Splash Screen
    splashScreen.classList.add('active');

    let countdown = 3;
    countdownDisplay.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.textContent = countdown;
        } else if (countdown === 0) {
            countdownDisplay.textContent = countdown;
            countdownDisplay.style.display = 'none'; // Sembunyikan angka 0
            const birthdayText = 'HAPPY BIRTHDAY SAYANGKUU!! SUCI WULANDARI';
        birthdayMessageDisplay.innerHTML = ''; // Kosongkan dulu

        birthdayText.split('').forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter; // Handle spasi
            birthdayMessageDisplay.appendChild(span);
            setTimeout(() => {
                span.classList.add('visible');
            }, index * 30); // Jeda 100ms antar huruf (bisa disesuaikan)
        });
    } else {
            clearInterval(countdownInterval);
            // Fade Out Splash Screen dan Fade In Main Content
            splashScreen.classList.remove('active');
            mainContent.classList.add('visible');


            initializeGridGallery();
        }
    }, 800);
}, { once: true });
    
    // --- [PERUBAHAN UTAMA] Logika untuk Galeri Foto Grid ---
    function initializeGridGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        // [DIUBAH] Ganti angka total gambar menjadi 100
        const totalImages = 100;

        for (let i = 1; i <= totalImages; i++) {
            const img = document.createElement('img');
            img.src = `img/gallery/${i}.jpg`;
            img.classList.add('gallery-item');
            galleryContainer.appendChild(img);
        }

        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            // [DIUBAH] Perkecil jeda agar 100 gambar muncul lebih cepat
            setTimeout(() => {
                item.classList.add('show');
            }, index * 1000); 
        });
    }


    // --- Logika Menu Utama ---
    function initializeMainMenu() {
        // [DIUBAH] Variabel musik dipindahkan ke sini agar bisa diakses
        const music = document.getElementById('background-music');
        
        const cubeContainer = document.querySelector('.cube-container');
        const mediaPlayer = document.querySelector('.media-player-container');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const songTitleEl = document.getElementById('song-title');
        const songArtistEl = document.getElementById('song-artist');
        const playlistContainer = document.querySelector('.playlist');
        const navContainer = document.querySelector('.nav-container');
        const missionContainer = document.querySelector('.mission-container');
        const backButton = document.querySelector('.back-button');
        const menuItems = document.querySelectorAll('.menu-item');
        let activeIndex = 0;
        
       // [BARU] Daftar Lagu Anda
        const playlist = [
            { title: 'Everything You Are', artist: 'Hindia', src: 'audio/hindia.mp3' },
            { title: 'Kita Usahakan Rumah Itu', artist: 'Sal Priadi', src: 'audio/kitausahakanrumahitu.mp3' },
            { title: 'Last Night on Earth', artist: 'Green Day', src: 'audio/lastnight.mp3' },
            { title: 'Nobody Else', artist: 'LANY', src: 'audio/nobodyelse.mp3' },
            { title: 'Nothing', artist: 'Bruno Major', src: 'audio/nothing.mp3' },
            { title: 'Anything 4 U', artist: 'LANY', src: 'audio/anything4u.mp3' },
            { title: 'No', artist: 'LANY', src: 'audio/no.mp3' },
            { title: 'Happiness', artist: 'Rex Orange County', src: 'audio/happiness.mp3' },
            { title: 'Bercinta Lewat Kata', artist: 'Donne Maula', src: 'audio/bercintalewatkata.mp3' },
            { title: 'Cahaya', artist: 'TULUS', src: 'audio/cahaya.mp3' },
            { title: 'Blessed', artist: 'Daniel Cesar', src: 'audio/blessed.mp3' },
            // Tambahkan lagu lain di sini
        ];
        let currentTrackIndex = 8;

        // [BARU] Logika untuk SHUFFLE lagu pertama
        // currentTrackIndex = Math.floor(Math.random() * playlist.length);
        
        // [BARU] Fungsi untuk memuat lagu
        function loadTrack(index) {
            const track = playlist[index];
            songTitleEl.textContent = track.title;
            songArtistEl.textContent = track.artist;
            music.src = track.src;
            
            // Update kelas 'active' di playlist
            document.querySelectorAll('.playlist-item').forEach((item, itemIndex) => {
                if (itemIndex === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        // [BARU] Fungsi untuk memutar lagu berikutnya
        function playNextTrack() {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            music.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

        // [BARU] Fungsi untuk memutar lagu sebelumnya
        function playPrevTrack() {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            music.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

        // [BARU] Isi container playlist dengan lagu dari array
        playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.classList.add('playlist-item');
            item.innerHTML = `<div class="title">${track.title}</div><div class="artist">${track.artist}</div>`;
            item.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                music.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
            playlistContainer.appendChild(item);
        });

        // Event listener untuk kubus (tidak berubah)
        cubeContainer.addEventListener('click', () => {
            mediaPlayer.classList.toggle('show');
            cubeContainer.classList.toggle('player-active');
            navContainer.classList.toggle('player-active');
        });

        // Event listener untuk Play/Pause (diperbarui)
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

        // Event listener baru untuk tombol Next dan Prev
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playNextTrack();
        });
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playPrevTrack();
        });

        // Event listener saat lagu selesai, putar lagu berikutnya
        music.addEventListener('ended', playNextTrack);
        // Muat lagu pertama (yang sudah di-shuffle)
        loadTrack(currentTrackIndex);

        // [BARU] Putar lagu secara otomatis setelah dimuat
        music.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';


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