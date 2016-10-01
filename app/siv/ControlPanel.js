const React = require('react');

function ControlPanel(props) {
  const {
    children,
    extensionName,
    isActive,
    onClose,
  } = props;

  const titleStyle = isActive ? { color: 'rgb(51, 122, 183)' } : '';

  return (
    <div className="ext-container">
      <div className="ext-title">
        <span style={titleStyle}>{extensionName}</span>
        <img src="../icons/ic_close_white_18px.svg" onClick={onClose} />
      </div>
      {children}
    </div>
  );
}

ControlPanel.propTypes = {
  extensionName: React.PropTypes.string.isRequired,
  isActive: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
};

module.exports = ControlPanel;
