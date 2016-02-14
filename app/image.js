'use strict'
const React = require('react')
const sivEvents = require('./siv-events')
const ImageLayer = React.createClass({
  extId: 'image',
  layerName: 'image',
  statics: {
    layerName: 'image'
  },
  propTypes: {
    zIndex: React.PropTypes.number.isRequired,
    sivState: React.PropTypes.object.isRequired,
    sivDispatch: React.PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      mouseDown: false,
      maxScale: 3,
      minScale: undefined,
      lastScale: undefined,
      img: undefined,
      scale: undefined,
      dx: undefined,
      dy: undefined
    }
  },
  componentDidMount () {
    this.props.sivDispatch(
      sivEvents.layerAdded(this.extId, this.refs.canvas)
    )
  },
  shouldComponentUpdate (nextProps, nextState) {
    // This component should only render if there is a new image to
    // draw, or if an already-drawn image is zoomed or panned.
    // Note: React ignores shouldComponentUpdate on the first render.
    const propsChange = (nextProps.sivState.currentImg !==
                         this.props.sivState.currentImg ||
                         nextProps.sivState.viewerDimensions.width !==
                         this.props.sivState.viewerDimensions.width ||
                         nextProps.sivState.viewerDimensions.height !==
                         this.props.sivState.viewerDimensions.height
                        )
    const stateChange = (nextState.dx !== this.state.dx ||
                         nextState.dy !== this.state.dy ||
                         nextState.mouseDown !== this.state.mouseDown ||
                         nextState.scale !== this.state.scale
                        )
    if (propsChange || stateChange) {
      return true
    }
    return false
  },
  componentWillReceiveProps (nextProps) {
    // Where you update the state based on the props coming in.
    const current = {
      viewerDimensions: this.props.sivState.viewerDimensions,
      img: this.state.img,
      scale: this.state.scale,
      dx: this.state.dx,
      dy: this.state.dy
    }
    const next = {
      viewerDimensions: nextProps.sivState.viewerDimensions,
      img: (() => {
        if (nextProps.sivState.currentImg) {
          const img = document.createElement('img')
          img.src = nextProps.sivState.currentImg
          return img
        }
        return undefined
      })()
    }
    const imgHasChanged = (() => {
      if (next.img && next.img.src && !current.img) {
        return true
      }
      if (next.img && current.img && next.img.src !== current.img.src) {
        return true
      }
      return false
    })()
    const viewerHasResized = (() => {
      if (next.viewerDimensions.width !== current.viewerDimensions.width ||
          next.viewerDimensions.height !== current.viewerDimensions.height) {
        return true
      }
      return false
    })()
    const img = (() => {
      if (imgHasChanged) {
        return next.img
      }
      return current.img
    })()
    const scale = (() => {
      if (img && (imgHasChanged || viewerHasResized)) {
        return this.scaleToFit(img,
                               next.viewerDimensions.width,
                               next.viewerDimensions.height)
      }
      return current.scale
    })()
    const pos = (() => {
      if (img && (imgHasChanged || viewerHasResized)) {
        return this.center(scale, img,
                           next.viewerDimensions.width,
                           next.viewerDimensions.height)
      }
      return {
        dx: current.dx,
        dy: current.dy
      }
    })()
    this.setState({img, scale, dx: pos.dx, dy: pos.dy, minScale: scale, lastScale: scale})
  },
  componentDidUpdate () {
    if (this.state.img) {
      this.drawImg()
    }
  },
  render () {
    const style = (() => {
      if (this.state.mouseDown) {
        return {
          zIndex: this.props.zIndex,
          cursor: 'move'
        }
      }
      return {
        zIndex: this.props.zIndex
      }
    })()
    return React.createElement('canvas', {
      ref: 'canvas',
      'data-extid': this.extId,
      style: style,
      width: this.props.sivState.viewerDimensions.width,
      height: this.props.sivState.viewerDimensions.height,
      onMouseMove: this.handleMouseMove,
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onWheel: this.handleScroll,
      className: 'Layer' })
  },
  handleMouseMove (event) {
    if (this.state.mouseDown) {
      this.setState({
        dx: this.state.dx + event.nativeEvent.movementX,
        dy: this.state.dy + event.nativeEvent.movementY
      })
    }
  },
  handleMouseDown () {
    this.setState({
      mouseDown: true
    })
  },
  handleMouseUp () {
    this.setState({
      mouseDown: false
    })
  },
  handleScroll (event) {
    const zoomIncr = (() => {
      return {
        up: Math.min(0.25, (this.state.maxScale - this.state.scale)),
        down: Math.max(-0.25, (this.state.minScale - this.state.scale))
      }
    })()
    const mousePos = this.getMousePos(event)
    const imgDrawn = {
      width: this.state.img.width * this.state.scale,
      height: this.state.img.height * this.state.scale
    }
    const mousePosOnImgDrawn = {
      x: (mousePos.x - this.state.dx) / imgDrawn.width,
      y: (mousePos.y - this.state.dy) / imgDrawn.height
    }
    const nextScale = (() => {
      if (event.deltaY < 0) {
        return this.state.scale + zoomIncr.up
      }
      return this.state.scale + zoomIncr.down
    })()
    const pos = (() => {
      if (nextScale === this.state.minScale) {
        return this.center(nextScale, this.state.img,
                           this.props.sivState.viewerDimensions.width,
                           this.props.sivState.viewerDimensions.height)
      }
      return {
        dx: mousePos.x - (this.state.img.width * nextScale) * mousePosOnImgDrawn.x,
        dy: mousePos.y - (this.state.img.height * nextScale) * mousePosOnImgDrawn.y
      }
    })()
    this.setState({dx: pos.dx, dy: pos.dy, scale: nextScale})
  },
  getMousePos (mouseEvent) {
    // Returns the cursor position relative to the canvas origin
    return {
      x: mouseEvent.clientX - this.props.sivState.viewerDimensions.left,
      y: mouseEvent.clientY - this.props.sivState.viewerDimensions.top
    }
  },
  scaleToFit (img, viewerWidth, viewerHeight) {
    if (img.width > viewerWidth || img.height > viewerHeight) {
      const scaleX = viewerWidth / img.width
      const scaleY = viewerHeight / img.height
      return Math.min(scaleX, scaleY)
    }
    return 1
  },
  center (scale, img, viewerWidth, viewerHeight) {
    const dx = viewerWidth * 0.5 - img.width * scale * 0.5
    const dy = viewerHeight * 0.5 - img.height * scale * 0.5
    return {dx, dy}
  },
  drawImg () {
    const img = this.state.img
    const dx = this.state.dx
    const dy = this.state.dy
    const scale = this.state.scale
    const scaledImgWidth = img.width * scale
    const scaledImgHeight = img.height * scale
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, dx, dy, scaledImgWidth, scaledImgHeight)
  }
})

module.exports = ImageLayer
