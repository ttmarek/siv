const React = require('react');
const FileBoxFile = require('../../../app/siv/file-box-file');
const renderer = require('react-test-renderer');

describe('<FileBoxFile />', () => {
  it('Renders correctly: Active state', () => {
    const component = renderer.create(
      <FileBoxFile
        currentImg="/path/to/some/img.jpg"
        fileBoxID={0}
        filePath="/path/to/some/img.jpg"
        onClick={jest.fn()}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
  it('Renders correctly: Inactive state', () => {
    const component = renderer.create(
      <FileBoxFile
        currentImg="/path/to/some/img.jpg"
        fileBoxID={0}
        filePath="/path/to/some/other/img.jpg"
        onClick={jest.fn()}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
