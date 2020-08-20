import { useEffect } from 'react'
import PropTypes from 'prop-types'
import getSelector from 'get-selector'

function injectStyle(css) {
	const styleElement = document.createElement('style')
	styleElement.setAttribute('type', 'text/css')
	styleElement.setAttribute('id', 'react-html-inspector__style__tag')
	styleElement.innerHTML = css
	document.head.appendChild(styleElement)
}

function clearStyle() {
	try {
		document.head.removeChild(
			document.getElementById('react-html-inspector__style__tag')
		)
	} catch (e) {}
}

const createCss = (className) => `
.${className} {
	cursor: crosshair !important;
	position: relative;
	user-select: none;
}
.${className}::after {
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	top: 0;
	background-color: rgba(255, 127, 80, 0.25);
	content: '';
	pointer-events: none;
	border: 1px solid coral;
}
input.${className} {
	background-color: rgba(255, 127, 80, 0.25);
}
`

export default function HTMLInspector(props) {
	const {
		onElementClick,
		rootElementSelector,
		inspectorClassName,
		active
	} = props

	useEffect(() => {
		injectStyle(createCss(inspectorClassName))
		return clearStyle
	}, [inspectorClassName])

	useEffect(() => {
		if (!active) return

		const elements = document.querySelectorAll(`${rootElementSelector} *`)

		if (!elements) return

		function noop(event) {
			event.preventDefault()
			event.stopPropagation()
		}

		function elementClicked(event) {
			event.preventDefault()
			event.stopPropagation()
			return onElementClick(getSelector(event.target))
		}

		function handleHover(e) {
			e.preventDefault()
			e.stopPropagation()
			Array.from(document.querySelectorAll(`.${inspectorClassName}`)).forEach(
				(el) => {
					el.classList.remove(inspectorClassName)
				}
			)
			e.target.classList.add(inspectorClassName)
			e.target.addEventListener('click', elementClicked)
			e.target.addEventListener('mousedown', noop)
			e.target.addEventListener('mouseup', noop)
		}

		function handleUnhover(e) {
			e.target.classList.remove(inspectorClassName)
			e.target.removeEventListener('click', elementClicked)
			e.target.removeEventListener('mousedown', noop)
			e.target.removeEventListener('mouseup', noop)
		}

		Array.from(elements).forEach((element) => {
			element.addEventListener('mouseover', handleHover)
			element.addEventListener('mouseleave', handleUnhover)
		})

		return () => {
			Array.from(elements).forEach((element) => {
				element.removeEventListener('mouseover', handleHover)
				element.removeEventListener('mouseleave', handleUnhover)
			})
		}
	}, [active, onElementClick, rootElementSelector, inspectorClassName])

	return null
}

HTMLInspector.propTypes = {
	rootElementSelector: PropTypes.string.isRequired,
	inspectorClassName: PropTypes.string,
	onElementClick: PropTypes.func,
	active: PropTypes.bool
}

HTMLInspector.defaultProps = {
	inspectorClassName: 'react-html-inspector__hovered',
	active: false,
	onElementClick: () =>
		console.warn('Inspector have not received onElementClick prop')
}
