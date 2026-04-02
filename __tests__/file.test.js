const fs = require('fs');

describe('File System', () => {
  test('index.html file should exist', () => {
    const filePath = './index.html';
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
