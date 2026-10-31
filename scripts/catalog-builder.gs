// Google Apps Script: يمسح مجلد المكتبة ويكتب catalog.json في مجلد My Drive.
const ROOT_ID = '1iRA1KDC09DH9SlY2ZiPc4kB6As7ZW29X';

function build() {
  const root = DriveApp.getFolderById(ROOT_ID);
  const tree = scan(root);
  const file = DriveApp.createFile('catalog.json', JSON.stringify(tree), MimeType.PLAIN_TEXT);
  Logger.log('تم إنشاء الفهرس: ' + file.getUrl());
}

function scan(folder) {
  const node = { id: folder.getId(), name: folder.getName(), folders: [], files: [] };

  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    node.files.push({ id: f.getId(), name: f.getName(), mime: f.getMimeType() });
  }

  const subs = folder.getFolders();
  while (subs.hasNext()) {
    node.folders.push(scan(subs.next()));
  }

  node.files.sort(byName);
  node.folders.sort(byName);
  return node;
}

function byName(a, b) {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}
