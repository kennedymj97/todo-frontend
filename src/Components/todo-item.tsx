import React, { useState } from 'react';
import styled from 'styled-components';

const TodoListItem = styled.li`
	position: relative;
	font-size: 24px;
	border-bottom: 1px solid #ededed;

	&:last-child {
		border-bottom: none;
	}

	label {
		word-break: break-all;
		padding: 15px 15px 15px 60px;
		display: block;
		line-height: 1.2;
		transition: color 0.4s;
	}

	${(props: ITodoListItemProps) =>
		props.completed
			? `
		label {
			color: #d9d9d9;
			text-decoration: line-through;
		}
		`
			: ``};

	${(props: ITodoListItemProps) =>
		props.editing
			? `
		&:last-child {
			margin-bottom: -1px;
		}

		border-bottom: none;
		padding: 0;
	`
			: `
	
	`};
`;

const TodoContainer = styled.div`${(props: ITodoListItemProps) => (props.editing ? `display: none` : ``)};`;

const TodoToggle = styled.input`
	text-align: center;
	width: 40px;
	/* auto, since non-WebKit browsers doesn't support input styling */
	height: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto 0;
	border: none; /* Mobile Safari */
	-webkit-appearance: none;
	appearance: none;
	opacity: 0;

	& + label {
		background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
		background-repeat: no-repeat;
		background-position: center left;
	}

	&:checked + label {
		background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
	}
`;

const DestroyTodo = styled.button`
	display: none;
	position: absolute;
	top: 0;
	right: 10px;
	bottom: 0;
	width: 40px;
	height: 40px;
	margin: auto 0;
	font-size: 30px;
	color: #cc9a9a;
	margin-bottom: 11px;
	transition: color 0.2s ease-out;

	&:hover {
		color: #af5b5e;
	}

	&:after {
		content: 'x';
	}

	${TodoListItem}:hover & {
		display: block;
	}
`;

const EditTodo = styled.input`
	display: block;
	box-sizing: border-box;
	width: calc(100% - 43px);
	padding: 12px 16px;
	margin: 0 0 0 43px;
	font-size: inherit;
`;

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
			<TodoListItem completed={props.todo.completed} editing={props.editing}>
				<TodoContainer editing={props.editing}>
					<TodoToggle
						type="checkbox"
						checked={props.todo.completed}
						onChange={props.onToggle}
					/>
					<label onDoubleClick={(e) => handleEdit()}>{props.todo.content}</label>
					<DestroyTodo onClick={props.onDestroy} />
				</TodoContainer>
			</TodoListItem>
		);
	} else {
		return (
			<TodoListItem completed={props.todo.completed} editing={props.editing}
			>
				<EditTodo
					autoFocus
					value={text}
					onBlur={() => handleSubmit()}
					onChange={(e) => handleChange(e)}
					onKeyDown={(e) => handleKeyDown(e)}
				/>
			</TodoListItem>
		);
	}
};

export default TodoItem;
