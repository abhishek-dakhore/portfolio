$(document).ready(function () {
  const audio = $('#audio')[0];
  const progress = $('#progress');
  const titleDisplay = $('#song-title');
  let currentPlaylist = [];
  let currentIndex = 0;
  const playlists = {};

  function loadSong(index) {
    if (currentPlaylist.length > 0 && index >= 0 && index < currentPlaylist.length) {
      audio.src = currentPlaylist[index].url;
      titleDisplay.text(currentPlaylist[index].name);
      audio.play();
    }
  }

  $('#play').click(() => audio.play());
  $('#pause').click(() => audio.pause());

  $('#next').click(() => {
    if (currentIndex < currentPlaylist.length - 1) {
      currentIndex++;
      loadSong(currentIndex);
    }
  });

  $('#prev').click(() => {
    if (currentIndex > 0) {
      currentIndex--;
      loadSong(currentIndex);
    }
  });

  $('#vol-up').click(() => {
    audio.volume = Math.min(audio.volume + 0.1, 1);
  });

  $('#vol-down').click(() => {
    audio.volume = Math.max(audio.volume - 0.1, 0);
  });

  audio.ontimeupdate = () => {
    if (!isNaN(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.val(percent);
    }
  };

  progress.on('input', () => {
    if (!isNaN(audio.duration)) {
      const seekTime = (progress.val() / 100) * audio.duration;
      audio.currentTime = seekTime;
    }
  });

  $('#create-playlist').click(function () {
    const name = prompt('Enter playlist name:');
    if (name && !playlists[name]) {
      playlists[name] = [];
      renderPlaylists();
    } else {
      alert('Invalid or duplicate name.');
    }
  });

  function renderPlaylists() {
    const list = $('#playlist-list');
    list.empty();

    for (const name in playlists) {
      const li = $('<li>').addClass('playlist-item');
      const title = $('<span>').text(name).addClass('playlist-title');

      const renameBtn = $('<button>').text('✏️').click(() => {
        const newName = prompt('Enter new name:');
        if (newName && !playlists[newName]) {
          playlists[newName] = playlists[name];
          delete playlists[name];
          renderPlaylists();
        } else {
          alert('Invalid or duplicate name.');
        }
      });

      const deleteBtn = $('<button>').text('🗑️').click(() => {
        delete playlists[name];
        renderPlaylists();
      });

      const openBtn = $('<button>').text('📂').click(() => {
        const input = $('<input type="file" accept="audio/*" multiple>').hide();
        $('body').append(input);
        input.on('change', function () {
          const files = Array.from(this.files);
          files.forEach(file => {
            playlists[name].push({ url: URL.createObjectURL(file), name: file.name });
          });
          currentPlaylist = playlists[name];
          currentIndex = 0;
          loadSong(currentIndex);
          input.remove();
        });
        input.click();
      });

      li.append(title, openBtn, renameBtn, deleteBtn);
      list.append(li);
    }
  }
});
