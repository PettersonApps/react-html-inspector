import React, { useState } from 'react'

import HTMLInspector from 'react-html-inspector'

const testAreaStyle = {
	textAlign: 'center',
	margin: 100
}

const App = () => {
	const [active, setActive] = useState(false)

	return (
		<div id='root'>
			<div id='test-area' style={testAreaStyle}>
				<span>text text</span>
				<br />
				<br />
				<button type='button'>THIS IS BUTTON</button>
				<br />
				<br />
				<input type='text' />
			</div>
			<div style={{ textAlign: 'center' }}>
				<input
					id='checkbox'
					type='checkbox'
					checked={active}
					onChange={() => setActive(!active)}
					style={{ margin: 'auto' }}
				/>
				<label htmlFor='checkbox'>Toggle inspector</label>
			</div>
			<HTMLInspector
				rootElementSelector='#test-area'
				onElementClick={console.log}
				active={active}
			/>
		</div>
	)
}

export default App
