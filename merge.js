const fs = require('fs');
const path = require('path');

// Caminho dos arquivos
const membersFile = 'public/members.json';
const kofiFile = 'public/kofi.json';
const tempFile = 'public/members.tmp.json';

// Carregar os arquivos JSON
const members = JSON.parse(fs.readFileSync(membersFile, 'utf-8'));
const kofi = JSON.parse(fs.readFileSync(kofiFile, 'utf-8'));

// Criar um mapa para os logins do Kofi
const kofiMap = kofi.reduce((map, user) => {
  map[user.login] = user;
  return map;
}, {});

// Mesclar os dados de acordo com o login
members.forEach(member => {
  const login = member.login;
  if (login && kofiMap[login]) {
    const kofiUser = kofiMap[login];
    if (kofiUser.kofi_username) {
      member.kofi_username = kofiUser.kofi_username;
    }
  }
});

// Salvar o resultado no arquivo temporário
fs.writeFileSync(tempFile, JSON.stringify(members, null, 4), 'utf-8');

// Substituir o arquivo original pelo temporário
fs.renameSync(tempFile, membersFile);

console.log('Merge concluído!');

// Garantir que o arquivo temporário não permaneça
if (fs.existsSync(tempFile)) {
  fs.unlinkSync(tempFile);
  console.log('Arquivo temporário removido.');
}
