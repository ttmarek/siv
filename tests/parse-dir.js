const expect = require('chai').expect;
const parsedir = require('../build/parse-dir.js');
const Path = require('path');

const testDir = Path.join(__dirname, 'test_dir');

describe('Function parsedir', () => {
  describe("parsedir('some/non-existant/path')", () => {
    const getFilePaths = parsedir('some/non-existant/path');
    it('Returns an error', () => {
      return getFilePaths.catch(error => {
        expect(error).to.have.property('code');
        expect(error.code).to.equal('ENOENT');
      });
    });
  });
  
  describe("parsedir('test_dir/insect.jpg')", () => {
    const getFilePaths = parsedir(Path.join(testDir, 'insect.jpg'));
    it('Returns an object of the form {hierarchy: [], list: []}', () => {
      return getFilePaths.then(filePaths => {
        expect(filePaths).to.be.an('object');
        expect(filePaths).to.have.property('hierarchy');
        expect(filePaths).to.have.property('list');
        expect(filePaths.hierarchy).to.be.an('array');
        expect(filePaths.list).to.be.an('array');        
      });
    });
    
    it('Returns the right number of files', () => {
      return getFilePaths.then(filePaths => {
        expect(filePaths.hierarchy.length).to.equal(6);
        expect(filePaths.list.length).to.equal(6);
      });
    });
    
    it('Returns the right files, in the right order', () => {
      var expected = ['insect.jpg',
                      'polar bear.bmp',
                      'polar bear.jpeg',
                      'polar bear.jpg',
                      'polar bear.png',
                      'red bridge.jpg'];

      expected = expected.map(path => {
        return Path.join(testDir, path);
      });

      return getFilePaths.then(filePaths => {
        expect(filePaths.hierarchy).to.deep.equal(expected);
        expect(filePaths.list).to.deep.equal(expected);
      });
    });
  });

  describe("parsedir('test_dir/insect.jpg', 4)", () => {
    const getFilePaths = parsedir(Path.join(testDir, 'insect.jpg'), 4);
    it('Returns the right number of files', () => {
      return getFilePaths.then(filePaths => {
        expect(filePaths.hierarchy.length).to.equal(4);
        expect(filePaths.list.length).to.equal(4);
      });
    });

    it('Returns the right files, in the right order', () => {
      var expected = ['insect.jpg',
                      'polar bear.bmp',
                      'polar bear.jpeg',
                      'polar bear.jpg'];
      
      expected = expected.map(path => {
        return Path.join(testDir, path);
      });
      
      return getFilePaths.then(filePaths => {
        expect(filePaths.hierarchy).to.deep.equal(expected);
        expect(filePaths.list).to.deep.equal(expected);
      });
    });
  });

  describe("parsedir('test_dir')", () => {
    const getFilePaths = parsedir(testDir);
    it('Returns an object of the form {hierarchy: [], list: []}', () => {
      return getFilePaths.then(filePaths => {
        expect(filePaths).to.be.an('object');
        expect(filePaths).to.have.property('hierarchy');
        expect(filePaths).to.have.property('list');
        expect(filePaths.hierarchy).to.be.an('array');
        expect(filePaths.list).to.be.an('array');        
      });
    });
    
    it('Returns the right files, in the right order', () => {
      var hierarchy = ['insect.jpg',
                       'polar bear.bmp',
                       'polar bear.jpeg',
                       'polar bear.jpg',
                       'polar bear.png',
                       'red bridge.jpg',
                       {path: 'dir1',
                        contents: ['img#1.jpg',
                                   'img#2.bmp',
                                   'img#2.jpeg',
                                   'img#2.png',
                                   {path: ['dir1', 'dir3'].join(Path.sep),
                                    contents: ['img#2.jpg']}]},
                       {path: 'dir2',
                        contents: ['img(1).jpg',
                                   'img(2).jpg',
                                   {path: ['dir2', 'dir2'].join(Path.sep),
                                    contents: ['polar bear.jpeg',
                                               {path: ['dir2', 'dir2', 'dir1'].join(Path.sep),
                                                contents: ['img(1).jpg']}]}]},
                       {path: 'dir3.jpg',
                        contents: ['image one.jpg',
                                   'image two.jpg']}];

      const makeAbs = function makeAbs(paths, parent) {
        return paths.map(path => {
          if (typeof path === 'string') {
            if (parent) {
              return Path.join(testDir, parent, path);
            } else {
              return Path.join(testDir, path);
            }
          } else {
            return {path: Path.join(testDir, path.path),
                    contents: makeAbs(path.contents, path.path)};
          }
        });
      };

      hierarchy = makeAbs(hierarchy);

      var list = ['insect.jpg',
                  'polar bear.bmp',
                  'polar bear.jpeg',
                  'polar bear.jpg',
                  'polar bear.png',
                  'red bridge.jpg',
                  ['dir1', 'img#1.jpg'].join(Path.sep),
                  ['dir1', 'img#2.bmp'].join(Path.sep),
                  ['dir1', 'img#2.jpeg'].join(Path.sep),
                  ['dir1', 'img#2.png'].join(Path.sep),
                  ['dir1', 'dir3', 'img#2.jpg'].join(Path.sep),
                  ['dir2', 'img(1).jpg'].join(Path.sep),
                  ['dir2', 'img(2).jpg'].join(Path.sep),
                  ['dir2', 'dir2', 'polar bear.jpeg'].join(Path.sep),
                  ['dir2', 'dir2', 'dir1', 'img(1).jpg'].join(Path.sep),
                  ['dir3.jpg', 'image one.jpg'].join(Path.sep),
                  ['dir3.jpg', 'image two.jpg'].join(Path.sep)];
                  
      list = list.map(file => {
        return Path.join(testDir, file);
      });
      
      return getFilePaths.then(filePaths => {
        expect(filePaths.hierarchy).to.deep.equal(hierarchy);
        expect(filePaths.list).to.deep.equal(list);
      });
    });
  });

  describe("parsedir('test_dir', 8)", () => {
    const getFilePaths = parsedir(testDir, 8);
    it('Returns the right files, in the right order', () => {
      var hierarchy = ['insect.jpg',
                      'polar bear.bmp',
                      'polar bear.jpeg',
                      'polar bear.jpg',
                      'polar bear.png',
                      'red bridge.jpg',
                      {path: 'dir1',
                       contents: ['img#1.jpg',
                                  'img#2.bmp',
                                  {path: ['dir1', 'dir3'].join(Path.sep),
                                   contents: []}]},
                      {path: 'dir2',
                       contents: [{path: ['dir2', 'dir2'].join(Path.sep),
                                   contents: [{path: ['dir2', 'dir2', 'dir1'].join(Path.sep),
                                               contents: []}]}]},
                      {path: 'dir3.jpg',
                       contents: []}];

      const makeAbs = function makeAbs(paths, parent) {
        return paths.map(path => {
          if (typeof path === 'string') {
            if (parent) {
              return Path.join(testDir, parent, path);
            } else {
              return Path.join(testDir, path);
            }
          } else {
            return {path: Path.join(testDir, path.path),
                    contents: makeAbs(path.contents, path.path)};
          }
        });
      };

      hierarchy = makeAbs(hierarchy);

      var list = ['insect.jpg',
                  'polar bear.bmp',
                  'polar bear.jpeg',
                  'polar bear.jpg',
                  'polar bear.png',
                  'red bridge.jpg',
                  ['dir1', 'img#1.jpg'].join(Path.sep),
                  ['dir1', 'img#2.bmp'].join(Path.sep)];
                  
      list = list.map(file => {
        return Path.join(testDir, file);
      });
      
      return getFilePaths.then(filePaths => {
        expect(filePaths.hierarchy).to.deep.equal(hierarchy);
        expect(filePaths.list).to.deep.equal(list);
      });
    });    
  });
});
