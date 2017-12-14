import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Container, Header } from 'semantic-ui-react';

class Box extends Component {
	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={() => this.props.selectBox(this.props.row, this.props.col)}
			>
			</div>
		)
	}
}

class Board extends Component {
	render() {
		const width = this.props.cols * 14
		let boxClass = ''
		let rowsArr = this.props.boardFill.map((row, rowIndex) => {
			return row.map((col, colIndex) => {
				let boxId = rowIndex + '_' + colIndex
				boxClass = col ? 'box on' : 'box off'
				return (
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={rowIndex}
						col={colIndex}
						selectBox={this.props.selectBox}
					/>					
				)
			})
		})

		return (
			<div className='board' style={{width: width}}>
				{rowsArr}
			</div>
		)
	}
}

class Main extends Component {
	constructor() {
		super()
		this.rows = 50
		this.cols = 70
		this.speed = 100
		this.state = {
			generation: 0,
			boardFill: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
			newGame: true,
			playing: false,
			activeSpeed: 'fast'
		}
		this.selectBox = this.selectBox.bind(this)
	}

	seed = () => {
		let boardCopy = Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		boardCopy = boardCopy.map(row => row.map(col => Math.floor(Math.random() * 4) === 1 ? col = true : col))
		this.setState({
			boardFill: boardCopy
		})
	}

	play = () => {
		let currBoard = this.state.boardFill
		let nextBoard = this.state.boardFill.map(arr => arr.slice())
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				let count = 0
				if (i > 0) if (currBoard[i - 1][j]) count++
				if (i > 0 && j > 0) if (currBoard[i - 1][j - 1]) count++
				if (i > 0 && j < this.cols - 1) if(currBoard[i - 1][j + 1]) count++					
				if (j < this.cols - 1) if (currBoard[i][j + 1]) count++
				if (j > 0) if (currBoard[i][j - 1]) count++
				if (i < this.rows - 1) if (currBoard[i + 1][j]) count++
				if (i < this.rows - 1 && j > 0) if (currBoard[i + 1][j - 1]) count++
				if (i < this.rows - 1 && j < this.cols - 1) if (currBoard[i + 1][j + 1]) count++
				if (currBoard[i][j] && (count < 2 || count > 3)) nextBoard[i][j] = false
				if (!currBoard[i][j] && count === 3) nextBoard[i][j] = true
			}
		}
		this.setState({
			boardFill: nextBoard,
			generation: this.state.generation + 1
		})
	}

	// setSpeed = event => {

	// 	const activeSpeed = event.currentTarget.value
	// 	let speed = this.state.speed
	// 	if (activeSpeed === 'slow') {
	// 		speed = 1000
	// 	} else if (activeSpeed === 'medium') {
	// 		speed = 500
	// 	} else {
	// 		speed = 100
	// 	}
	// 	this.setState({
	// 		activeSpeed: activeSpeed,
	// 		speed: speed
	// 	})
	// 	if (this.state.playing) {
	// 		this.playButton()
	// 	}		
	// }

	slow = event => {
		console.log(event.currentTarget.value)
		this.speed = 1000
		if (this.state.playing) {
			this.playButton()			
		}
		this.setState({ 
			activeSpeed: event.currentTarget.value
		})
	}

	medium = event => {
		this.speed = 500
		if (this.state.playing) {
			this.playButton()			
		}
		this.setState({ 
			activeSpeed: event.currentTarget.value
		})		
	}

	fast = event => {
		this.speed = 100
		if (this.state.playing) {
			this.playButton()			
		}
		this.setState({
			activeSpeed: event.currentTarget.value
		})		
	}

	playButton = () => {
		if (this.state.newGame) {
			this.seed()
			this.setState({
				newGame: false
			})
		}
		clearInterval(this.intervalId)
		this.intervalId = setInterval(this.play, this.speed)
		this.setState({
			playing: true
		})
	}

	pauseButton = () => {
		clearInterval(this.intervalId)
		this.setState({
			playing: false
		})
	}

	resetButton = () => {
		clearInterval(this.intervalId)
		this.setState({
			boardFill: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
			generation: 0,
			newGame: true,
			playing: false
		})
	}

	selectBox = (row, col) => {
		let nextBoard = this.state.boardFill.map(arr => {
			return arr.slice()
		})
		nextBoard[row][col] = !nextBoard[row][col]
		this.setState({
			boardFill: nextBoard
		})		
	}

	setSeed = () => {
		this.resetButton()
		this.seed()
	}

	componentDidMount() {
		this.playButton()
	}

	buttonSpeedClass = speed => {
		return speed === this.state.activeSpeed ? 'activeSpeed' : ''
	}

	render() {
		return (
			<div>
				<Header as='h1' inverted color='grey'>
					The Game of Life
				</Header>
				<Container textAlign='center' >
					<Button.Group labeled className='buttonSettings'>
						<Button color='black' onClick={this.playButton} content='Play' icon='play' />
						<Button color='black' onClick={this.pauseButton} content='Pause' icon='pause' />
						<Button color='black' onClick={this.resetButton} content='Reset' icon='stop' />
						<Button color='black' onClick={this.seed} content='New Seed' />
					</Button.Group>
				</Container>
				<Container textAlign='center'>
					<Button.Group className='buttonSettings'>
						<Button color='black' className={this.buttonSpeedClass('slow')} onClick={this.slow} value='slow'>Slow</Button>
						<Button.Or />
						<Button color='black' className={this.buttonSpeedClass('medium')} onClick={this.medium} value='medium'>Medium</Button>
						<Button.Or />
						<Button color='black' className={this.buttonSpeedClass('fast')} onClick={this.fast} value='fast'>Fast</Button>
					</Button.Group>
					<Button.Group className='buttonSettings'>
						<Button color='black' value='slow'>30x50</Button>
						<Button.Or />
						<Button color='black' value='medium'>40x70</Button>
						<Button.Or />
						<Button color='black' value='fast'>50x100</Button>
					</Button.Group>					
				</Container>					
				<Board 
					boardFill={this.state.boardFill}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/>
				<h3>Generations: {this.state.generation}</h3>			
			</div>
		)
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));