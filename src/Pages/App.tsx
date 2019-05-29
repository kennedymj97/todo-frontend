import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import TodoItem from 'Components/todo-item';
import TodoFooter from 'Components/todo-footer';
import LoginModal from 'Components/modal';
import Button from 'Components/UI/button';

const TodoApp = styled.div`
	background: #fff;
	margin: 130px 0 40px 0;
	position: relative;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

	input::-webkit-input-placeholder {
		font-style: italic;
		font-weight: 300;
		color: #e6e6e6;
	}

	input::-moz-placeholder {
		font-style: italic;
		font-weight: 300;
		color: #e6e6e6;
	}

	input::input-placeholder {
		font-style: italic;
		font-weight: 300;
		color: #e6e6e6;
	}

	h1 {
		position: absolute;
		top: -155px;
		width: 100%;
		font-size: 100px;
		font-weight: 100;
		text-align: center;
		color: rgba(175, 47, 47, 0.15);
		-webkit-text-rendering: optimizeLegibility;
		-moz-text-rendering: optimizeLegibility;
		text-rendering: optimizeLegibility;
	}
`;

const TodoInput = styled.input`
	position: relative;
	margin: 0;
	width: 100%;
	font-size: 24px;
	font-family: inherit;
	font-weight: inherit;
	line-height: 1.4em;
	color: inherit;
	padding: 6px;
	border: 1px solid #999;
	box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
	box-sizing: border-box;
	padding: 16px 16px 16px 60px;
	border: none;
	background: rgba(0, 0, 0, 0.003);
	box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
`;

const TodoBody = styled.section`
	position: relative;
	z-index: 2;
	border-top: 1px solid #e6e6e6;
`;

const ToggleAll = styled.input`
	width: 1px;
	height: 1px;
	border: none; /* Mobile Safari */
	opacity: 0;
	position: absolute;
	right: 100%;
	bottom: 100%;

	& + label {
		width: 60px;
		height: 34px;
		font-size: 0;
		position: absolute;
		top: -52px;
		left: -13px;
		-webkit-transform: rotate(90deg);
		transform: rotate(90deg);
	}

	& + label:before {
		content: '❯';
		font-size: 22px;
		color: #e6e6e6;
		padding: 10px 27px 10px 27px;
	}

	&:checked + label:before {
		color: #737373;
	}
`;

const TodoList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const Nav = styled.nav`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
	padding: 10px;
	box-sizing: border-box;
`;

const Footer = styled.footer`
	margin: 65px auto 0;
	color: #bfbfbf;
	font-size: 10px;
	text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
	text-align: center;

	p {
		line-height: 1;
	}

	a {
		color: inherit;
		text-decoration: none;
		font-weight: 400;
	}

	a:hover {
		text-decoration: underline;
	}
`;

const App: React.FC = () => {
	const [ task, setTask ] = useState<string>('');
	const [ todos, setTodos ] = useState<ITodo[]>([]);
	const [ editing, setEditing ] = useState<string>("");
	const [ nowShowing, setNowShowing ] = useState<string>('all');
	const [ login, setLogin ] = useState<boolean>(false);
	const [ email, setEmail ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');

	const getTasks = async () => {
		const res = await axios.get('http://localhost:8080/api/tasks', {withCredentials: true});
		const tasks = res.data.tasks
		setTodos(tasks)
	};

	useEffect(() => {
		getTasks();
	}, [])

	const handleNewTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		// Change this so an attempt is made to post the task to the db.
		console.log(`Creating task: ${task}`);
		setTask('');
		event.preventDefault();
	};

	const toggleAll = (event: React.FormEvent<HTMLInputElement>) => {
		let newTodos;
		if (event.currentTarget.checked) {
			newTodos = todos.map((ele: any) => ({ ...ele, completed: true }));
		} else {
			newTodos = todos.map((ele: any) => ({ ...ele, completed: false }));
		}
		setTodos(newTodos);
	};

	const toggle = (todoToToggle: ITodo) => {
		// const newTodos = [ ...todos ];
		// newTodos[todoToToggle.id].completed = !todos[todoToToggle.id - 1].completed;
		// const 
		// setTodos(newTodos);
	};

	const destroy = (todo: ITodo) => {
		setTodos(
			todos.filter((candidate) => {
				return candidate !== todo;
			})
		);
	};

	const edit = (todo: ITodo) => {
		setEditing(todo.id);
	};

	const save = (todoToSave: ITodo, text: string) => {
		const newTodos = [ ...todos ];
		// newTodos[todoToSave.id - 1].title = text;
		// setTodos(newTodos);
		// setEditing(0);
	};

	const cancel = () => {
		setEditing("");
	};

	const clearCompleted = () => {
		const remainingTodos = todos.filter((todo: ITodo) => {
			return !todo.completed;
		});
		setTodos(remainingTodos);
	};

	const loginUser = async () => {
		await axios.post('http://localhost:8080/api/users/login', { email: email, password: password }, {withCredentials: true});
		setLogin(false)
		getTasks();
	};

	const shownTodos = todos.filter((todo) => {
		switch (nowShowing) {
			case 'active':
				return !todo.completed;
			case 'completed':
				return todo.completed;
			default:
				return true;
		}
	});

	const todoItems = shownTodos.map((todo) => (
		<TodoItem
			key={todo.id}
			todo={todo}
			onToggle={() => toggle(todo)}
			onDestroy={() => destroy(todo)}
			onEdit={() => edit(todo)}
			editing={editing === todo.id}
			onSave={(text) => save(todo, text)}
			onCancel={() => cancel()}
		/>
	));

	const activeTodoCount = todos.reduce(function(accum, todo) {
		return todo.completed ? accum : accum + 1;
	}, 0);

	let main;
	if (todos.length) {
		main = (
			<TodoBody>
				<ToggleAll
					id="toggle-all"
					type="checkbox"
					onChange={(e) => toggleAll(e)}
					checked={activeTodoCount === 0}
				/>
				<label htmlFor="toggle-all">Mark all as complete</label>
				<TodoList>{todoItems}</TodoList>
			</TodoBody>
		);
	}

	const completedCount = todos.length - activeTodoCount;

	let footer;
	if (activeTodoCount || completedCount) {
		footer = (
			<TodoFooter
				count={activeTodoCount}
				completedCount={completedCount}
				nowShowing={nowShowing}
				onClearCompleted={() => clearCompleted()}
				setShowing={(val) => setNowShowing(val)}
			/>
		);
	}

	return (
		<React.Fragment>
			<Nav>
				<Button onClick={() => setLogin(true)}>Login</Button>
			</Nav>
			<TodoApp>
				<h1>todos</h1>
				<form onSubmit={(e) => handleNewTodoSubmit(e)}>
					<TodoInput
						value={task}
						placeholder="What needs to be done?"
						onChange={(e) => setTask(e.target.value)}
						autoFocus={true}
					/>
				</form>
				{main}
				{footer}
				<LoginModal active={login} backgroundClicked={() => setLogin(false)}>
					<h2>login</h2>
					<label>Email</label>
					<input placeholder={'Enter email here'} value={email} onChange={(e) => setEmail(e.target.value)} />
					<label>Password</label>
					<input
						type="password"
						placeholder={'Enter password here'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button onClick={() => loginUser()}>Confirm</Button>
				</LoginModal>
			</TodoApp>
			<Footer>
				<p>Double-click to edit a todo</p>
				<p>Created by Matthew Kennedy</p>
				<p>
					Inspired by <a href="http://todomvc.com">TodoMVC</a>
				</p>
			</Footer>
		</React.Fragment>
	);
};

export default App;
