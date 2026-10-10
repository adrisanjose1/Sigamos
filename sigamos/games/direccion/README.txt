SIGAMOS — Listening Exam
========================
Open index.html in a browser (Chrome / Safari). Keep the folders next to it.

index.html      the app (Reseña + Examen)
style.css       original Sigamos look
listening.css   new styles (voice slider, waveform, menu, red/green answers)
data.js         voices (names + pictures), the 42 commands, wrong answers, Mexican explanations
sounds.js / sprites.js   original sounds + Dudu / card art
audio/<voice>/NN.mp3     the 5 voices, same numbering as your files
audio/sfx/               card-place 1-2 (cards flick in) + carousel-pick 1-2 (next card)
img/            profile pictures + cat GIFs

Change a voice name: data.js -> window.VOICES -> "name".
Wrong answers: data.js -> each command's "wrong" list; [word] = shown in red after answering.

Voices: Adri, Guerito, Flancito, Horchatita, Señora Fluff (rename in data.js).
