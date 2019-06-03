import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import TodoItem from 'Components/todo-item';
import TodoFooter from 'Components/todo-footer';
import LoginModal from 'Components/modal';
import Button from 'Components/UI/button';
import NotAuthed from 'Components/not-auth';

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
	margin-top: ${(props: INavProps) => (props.error ? '6vh' : '0')};
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

const ErrorHeader = styled.header`
	width: 100vw;
	height: 5vh;
	background: red;
	color: white;
	font-size: 16px;
	font-weigth: 400;
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0;
	left: 0;
`;

const LoginForm = styled.form`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	justify-content: center;
`;

const BASE_URL: string = 'http://ec2-34-250-151-5.eu-west-1.compute.amazonaws.com:8080';
// const BASE_URL: string = 'http://localhost:8080';

const App: React.FC = () => {
	// variable for the task input field
	const [ task, setTask ] = useState<string>('');
	// state of todos
	const [ todos, setTodos ] = useState<ITodo[]>([]);
	// id of a todo being edited
	const [ editing, setEditing ] = useState<string>('');
	// which todos are showing (all, active, completed)
	const [ nowShowing, setNowShowing ] = useState<string>('all');
	// is the login modal active
	const [ login, setLogin ] = useState<boolean>(false);
	// variables for login/signup
	const [ email, setEmail ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');
	const [ confirmPassword, setConfirmPassword ] = useState<string>('')
	// has an error occured contacting server
	const [ error, setError ] = useState<boolean>(false);
	// is the user logged in
	const [ authorized, setAuthorized ] = useState<boolean>(false);
	// used to toggle login/signup
	const [ isLogin, setIsLogin ] = useState<boolean>(true);

	const getTasks = async () => {
		try {
			const res = await axios.get(BASE_URL + '/api/tasks', { withCredentials: true });
			setError(false);
			if (res.status === 200) {
				setAuthorized(true);
				const tasks = res.data.tasks;
				if (tasks !== null) {
					tasks.reverse();
					setTodos(tasks);
				} else {
					setTodos([]);
				}
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	};

	useEffect(() => {
		getTasks();
	}, []);

	const handleNewTodoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		// Change this so an attempt is made to post the task to the db.
		event.preventDefault();
		try {
			const res = await axios.post(BASE_URL + '/api/tasks/create', { content: task }, { withCredentials: true });
			if (res.status === 200) {
				setAuthorized(true);
				setError(false);
				setTask('');
				getTasks();
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	};

	const toggleAll = async (event: React.FormEvent<HTMLInputElement>) => {
		try {
			let res;
			if (event.currentTarget.checked) {
				res = await axios.post(BASE_URL + '/api/tasks/toggleAll', { val: true }, { withCredentials: true });
			} else {
				res = await axios.post(BASE_URL + '/api/tasks/toggleAll', { val: false }, { withCredentials: true });
			}
			if (res.status === 200) {
				setAuthorized(true);
				setError(false);
				getTasks();
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	};

	const toggle = async (todoToToggle: ITodo) => {
		try {
			const res = await axios.post(
				BASE_URL + '/api/tasks/toggle',
				{ id: todoToToggle.id, val: !todoToToggle.completed },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				setAuthorized(true);
				setError(false);
				getTasks();
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	};

	const destroy = async (todo: ITodo) => {
		try {
			const res = await axios.delete(BASE_URL + `/api/tasks/delete/${todo.id}`, { withCredentials: true });
			if (res.status === 200) {
				setAuthorized(true);
				setError(false);
				getTasks();
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	};

	const edit = (todo: ITodo) => {
		setEditing(todo.id);
	};

	const save = async (todoToSave: ITodo, text: string) => {
		try {
			const res = await axios.post(
				BASE_URL + '/api/tasks/edit',
				{ id: todoToSave.id, content: text },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				setAuthorized(true);
				setError(false);
				getTasks();
				setEditing('');
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	};

	const cancel = () => {
		setEditing('');
	};

	const clearCompleted = async () => {
		try {
			const res = await axios.delete(BASE_URL + '/api/tasks/clearCompleted', { withCredentials: true });
			if (res.status === 200) {
				setAuthorized(true);
				setError(false);
				getTasks();
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	};

	const loginUser = async () => {
		try {
			const res = await axios.post(
				BASE_URL + '/api/users/login',
				{ email: email, password: password },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				setAuthorized(true);
				setError(false);
				setLogin(false);
				getTasks();
			} else if (res.status === 401) {
				setAuthorized(false);
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
	}

	const loginUserSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		loginUser()
	};

	const signupUser = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			if (password !== confirmPassword) {
				alert('Passwords do not match!')
				return
			}
			const res = await axios.post(
				BASE_URL + '/api/users/create',
				{ email: email, password: password },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				loginUser()
			}
		} catch (error) {
			if (error == 'Error: Network Error') {
				setError(true);
			}
		}
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
			{error ? <ErrorHeader>Error: failed to connect to the server.</ErrorHeader> : null}
			<Nav error={error}>
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
					{isLogin ? (
						<LoginForm onSubmit={(e) => loginUserSubmit(e)}>
							<h2>login</h2>
							<label>Email</label>
							<input
								placeholder={'Enter email here'}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<label>Password</label>
							<input
								type="password"
								placeholder={'Enter password here'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button>Confirm</Button>
							<span onClick={() => setIsLogin(false)}>Don't have an account? Signup.</span>
						</LoginForm>
					) : (
						<LoginForm onSubmit={(e) => signupUser(e)}>
							<h2>signup</h2>
							<label>Email</label>
							<input
								placeholder={'Enter email here'}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<label>Password</label>
							<input
								type="password"
								placeholder={'Enter password here'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<label>Confirm Password</label>
							<input
								type="password"
								placeholder={'Enter password here'}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<Button>Confirm</Button>
							<span onClick={() => setIsLogin(true)}>Already have an account? Login.</span>
						</LoginForm>
					)}
				</LoginModal>
			</TodoApp>
			{authorized ? null : <NotAuthed>Login to create a new task.</NotAuthed>}
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
