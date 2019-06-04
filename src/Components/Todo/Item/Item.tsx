import React, { useState } from 'react';

import classes from './Item.module.css'

const TodoItem: React.FunctionComponent<ITodoItemProps> = (props) => {
	const [ text, setText ] = useState(props.todo.content);

	const handleSubmit = () => {
		const val = text.trim();
		if (val) {
			props.onSave(val);
			// setText(val);
		} else {
			props.onDestroy();
		}
	};

	const handleEdit = () => {
		props.onEdit();
		setText(props.todo.content);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Escape') {
			setText(props.todo.content);
			props.onCancel(event);
		} else if (event.key === 'Enter') {
			handleSubmit();
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	if (!props.editing) {
		return (
			<li className={classes.TodoListItem}>
				<div style={props.editing ? {display: 'none'} : {}}>
					<input
						className={classes.TodoToggle}
						type="checkbox"
						checked={props.todo.completed}
						onChange={props.onToggle}
					/>
					<label style={props.todo.completed ? {color: '#d9d9d9', textDecoration: 'line-through'} : {}} onDoubleClick={(e) => handleEdit()}>{props.todo.content}</label>
					<button className={classes.DestroyTodo} onClick={props.onDestroy} />
				</div>
			</li>
		);
	} else {
		return (
			<li className={classes.TodoListItem} style={{borderBottom: 'none', padding: '0'}}>
				<input
					className={classes.EditTodo}
					autoFocus
					value={text}
					onBlur={() => handleSubmit()}
					onChange={(e) => handleChange(e)}
					onKeyDown={(e) => handleKeyDown(e)}
				/>
			</li>
		);
	}
};

export default TodoItem;
