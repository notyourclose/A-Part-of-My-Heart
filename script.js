(() => {
  const revealSections = document.querySelectorAll(".reveal-section");

  if (!revealSections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealSections.forEach((section, index) => {
    section.style.transitionDelay = `${index * 90}ms`;
    observer.observe(section);
  });
})();

(() => {
  const tracks = [
    "audio/Forever and Ever and Ever (Movie_ Saiyaara).mp3",
    "audio/I'm Not Letting You Go! (Movie_ Saiyaara).mp3",
    "audio/Pata Chal Gaya Na! (Movie_ Saiyaara).mp3",
    "audio/Taaron Mein Ek Tanha Taara (Movie_ Saiyaara).mp3",
    "audio/Woh Aayegi, Bhaagte Hue, I Promise (Movie_ Saiyaara).mp3",
  ];

  if (!tracks.length) return;

  const unlockButton = document.getElementById("audio-unlock");
  const player = new Audio();
  player.preload = "metadata";
  let currentTrack = 0;
  let isUnlocked = false;

  const setLockedUi = (isLocked) => {
    document.body.classList.toggle("audio-locked", isLocked);
    if (!unlockButton) return;
    unlockButton.classList.toggle("hidden", !isLocked);
  };

  const playTrack = async (index) => {
    currentTrack = index % tracks.length;
    player.src = tracks[currentTrack];
    await player.play();
    isUnlocked = true;
    setLockedUi(false);
  };

  player.addEventListener("ended", () => {
    playTrack((currentTrack + 1) % tracks.length).catch(() => {
      if (unlockButton) unlockButton.classList.remove("hidden");
    });
  });

  const startPlaylist = async () => {
    await playTrack(0);
  };

  startPlaylist().catch(() => {
    setLockedUi(true);

    const tryUnlock = () => {
      if (isUnlocked) return;
      startPlaylist().catch(() => {});
    };

    if (unlockButton) {
      unlockButton.addEventListener("click", tryUnlock, { once: true });
    }

    window.addEventListener("pointerdown", tryUnlock, { once: true });
    window.addEventListener("keydown", tryUnlock, { once: true });
  });
})();
