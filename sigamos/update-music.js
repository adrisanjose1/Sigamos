// Lists assets/music/ into assets/music/playlist.json (only needed when the server shows no folder listing).
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'assets', 'music');
const ok = /\.(mp3|ogg|oga|wav|m4a|aac|flac|opus|weba|jpe?g|png|webp|gif|svg)$/i;
const files = fs.readdirSync(dir).filter(f => ok.test(f)).sort();
fs.writeFileSync(path.join(dir, 'playlist.json'), JSON.stringify(files, null, 2));
console.log('playlist.json updated: ' + files.length + ' files');
