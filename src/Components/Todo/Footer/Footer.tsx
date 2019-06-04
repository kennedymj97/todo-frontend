import React from 'react';
import classes from './Footer.module.css';

import Filter from 'Components/Todo/Footer/Filters/Filter'

const TodoFooter: React.FC<ITodoFooterProps> = (props) => {
	const activeTodoWord = props.count === 1 ? 'item' : 'items';
	let clearButton = null;

	if (props.completedCount > 0) {
		clearButton = (
			<button className={classes.ClearButton} onClick={props.onClearCompleted}>
				Clear completed
			</button>
		);
	}

	return (
		<footer className={classes.TodoFooterContainer}>
			<span className={classes.TodoCount}>
				<strong>{props.count}</strong> {activeTodoWord} left
			</span>
			<ul className={classes.Filters}>
				<Filter clicked={() => props.setShowing('all')} selected={props.nowShowing === 'all'}>All</Filter>{' '}
				<Filter clicked={() => props.setShowing('active')} selected={props.nowShowing === 'active'}>Active</Filter>{' '}
				<Filter clicked={() => props.setShowing('completed')} selected={props.nowShowing === 'completed'}>Completed</Filter>
			</ul>
			{clearButton}
		</footer>
	);
};

export default TodoFooter;
