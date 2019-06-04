import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

import TodoItem from 'Components/Todo/Item/Item';
import TodoFooter from 'Components/Todo/Footer/Footer';
import LoginModal from 'Components/Modal/Modal';
import Button from 'Components/UI/Button/Button';
import NotAuthed from 'Components/Warnings/Auth/Auth';
import Spinner from 'Components/UI/Loader/Loader';
import classes from './App.module.css';
import uuidv1 from 'uuid/v1';

/*

TODOS:
- make it so all offline activity is saved instead of removed?
- improve warning messages on inputs
*/

const BASE_URL: string = 'http://ec2-34-250-151-5.eu-west-1.compute.amazonaws.com:8080';

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
	const [ confirmPassword, setConfirmPassword ] = useState<string>('');
	// has an error occured contacting server
	const [ error, setError ] = useState<boolean>(false);
	// is the user logged in
	const [ authorized, setAuthorized ] = useState<boolean>(false);
	// used to toggle login/signup
	const [ isLogin, setIsLogin ] = useState<boolean>(true);
	// used to toggle fetching data loading state
	const [ loading, setLoading ] = useState<boolean>(false);
	// used to toggle logging in loading state
	const [ loggingIn, setLoggingIn ] = useState<boolean>(false);

	// handleError deals with errors produced when fetching data
	const handleError = (error: AxiosError) => {
		if (error.response && error.response.status === 401) {
			setAuthorized(false)
		} else if (error.response && error.response.status === 400) {
			alert('Username or password is incorrect.')
		} else {
			setError(true)
		}
		setLoading(false);
	};

	// handleResponse deals with the response from the axios requests
	const handleResponse = (res: AxiosResponse) => {
		if (res.status === 200) {
			setAuthorized(true);
			setError(false);
		}
	};

	// getTasks retrieves all of the users tasks from the database
	const getTasks = useCallback(async () => {
		try {
			setLoading(true);
			setError(false);
			const res = await axios.get(BASE_URL + '/api/tasks', { withCredentials: true });
			if (res.status === 200) {
				setAuthorized(true);
				const tasks = res.data.tasks;
				if (tasks !== null) {
					tasks.reverse();
					setTodos(tasks);
				} else {
					setTodos([]);
				}
			}
			setLoading(false);
		} catch (error) {
			handleError(error);
		}
	}, []);

	useEffect(() => {
		getTasks();
	}, [getTasks]);

	// handleNewTodoSubmit adds a todo and posts it to the backend
	const handleNewTodoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		// Change this so an attempt is made to post the task to the db.
		event.preventDefault();
		const newTodos = [ ...todos ];
		const id = uuidv1();
		newTodos.unshift({ id: id, content: task, completed: false });
		setTodos(newTodos);
		setTask('');
		try {
			const res = await axios.post(
				BASE_URL + '/api/tasks/create',
				{ id: id, content: task },
				{ withCredentials: true }
			);
			handleResponse(res);
		} catch (error) {
			handleError(error);
		}
	};

	// toggleAll toggles the state of all of the todos
	const toggleAll = async (event: React.FormEvent<HTMLInputElement>) => {
		const newTodos = [ ...todos ];
		if (event.currentTarget.checked) {
			newTodos.forEach((ele) => {
				ele.completed = true;
			});
		} else {
			newTodos.forEach((ele) => {
				ele.completed = false;
			});
		}
		setTodos(newTodos);
		try {
			let res;
			if (event.currentTarget.checked) {
				res = await axios.post(BASE_URL + '/api/tasks/toggleAll', { val: true }, { withCredentials: true });
			} else {
				res = await axios.post(BASE_URL + '/api/tasks/toggleAll', { val: false }, { withCredentials: true });
			}
			handleResponse(res);
		} catch (error) {
			handleError(error);
		}
	};

	// toggle switches toggles the selected todo's completed state
	const toggle = async (todoToToggle: ITodo) => {
		const newTodos = [ ...todos ];
		newTodos.forEach((ele) => {
			if (ele.id === todoToToggle.id) {
				ele.completed = !todoToToggle.completed;
			}
		});
		setTodos(newTodos);
		try {
			const res = await axios.post(
				BASE_URL + '/api/tasks/toggle',
				{ id: todoToToggle.id, val: todoToToggle.completed },
				{ withCredentials: true }
			);
			handleResponse(res);
		} catch (error) {
			handleError(error);
		}
	};

	// destroy deletes a todo
	const destroy = async (todo: ITodo) => {
		const newTodos = todos.filter((ele) => {
			return ele.id !== todo.id;
		});
		setTodos(newTodos);
		try {
			const res = await axios.delete(BASE_URL + `/api/tasks/delete/${todo.id}`, { withCredentials: true });
			handleResponse(res);
		} catch (error) {
			handleError(error);
		}
	};

	// save updates the todo's content
	const save = async (todoToSave: ITodo, text: string) => {
		const newTodos = [ ...todos ];
		newTodos.forEach((ele) => {
			if (ele.id === todoToSave.id) {
				ele.content = text;
			}
		});
		setTodos(newTodos);
		setEditing('');
		try {
			const res = await axios.post(
				BASE_URL + '/api/tasks/edit',
				{ id: todoToSave.id, content: text },
				{ withCredentials: true }
			);
			handleResponse(res);
		} catch (error) {
			handleError(error);
		}
	};

	// clearCompleted deletes all of the completed todos
	const clearCompleted = async () => {
		const newTodos = todos.filter((ele) => {
			return ele.completed === false;
		});
		setTodos(newTodos);
		try {
			const res = await axios.delete(BASE_URL + '/api/tasks/clearCompleted', { withCredentials: true });
			handleResponse(res);
		} catch (error) {
			handleError(error);
		}
	};

	// loginUser creates a new user session
	const loginUser = async () => {
		try {
			setLoggingIn(true);
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
			}
			setLoggingIn(false);
		} catch (error) {
			handleError(error);
			setAuthorized(false);
			setLoggingIn(false);
		}
	};

	// loginUserSubmit handles submission of the login form
	const loginUserSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		loginUser();
	};

	// signupUser creates a new user session and logs the user in
	const signupUser = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			if (password !== confirmPassword) {
				alert('Passwords do not match!');
				return;
			}
			setLoggingIn(true);
			const res = await axios.post(
				BASE_URL + '/api/users/create',
				{ email: email, password: password },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				loginUser();
			}
			setLoggingIn(false);
		} catch (error) {
			handleError(error);
			setLoggingIn(false);
		}
	};

	const logoutUser = async () => {
		setAuthorized(false);
		setTodos([]);
		try {
			await axios.delete(BASE_URL + '/api/users/logout', { withCredentials: true });
		} catch (error) {
			handleError(error);
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
			onEdit={() => setEditing(todo.id)}
			editing={editing === todo.id}
			onSave={(text) => save(todo, text)}
			onCancel={() => setEditing('')}
		/>
	));

	const activeTodoCount = todos.reduce(function(accum, todo) {
		return todo.completed ? accum : accum + 1;
	}, 0);

	let main;
	if (todos.length) {
		main = (
			<div className={classes.TodoBody}>
				<input
					className={classes.ToggleAll}
					id="toggle-all"
					type="checkbox"
					onChange={(e) => toggleAll(e)}
					checked={activeTodoCount === 0}
				/>
				<label htmlFor="toggle-all">Mark all as complete</label>
				<ul className={classes.TodoList}>{todoItems}</ul>
			</div>
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
			{error ? (
				<header className={classes.ErrorHeader}>
					Error: failed to connect to the server. Recent changes made may be lost.
				</header>
			) : null}
			<nav className={classes.Nav} style={{ marginTop: error ? '6vh' : '0' }}>
				{authorized ? (
					<Button clicked={() => logoutUser()}>Logout</Button>
				) : (
					<Button clicked={() => setLogin(true)}>Login</Button>
				)}
			</nav>
			<div className={classes.TodoApp}>
				<h1>todos</h1>
				<form onSubmit={(e) => handleNewTodoSubmit(e)}>
					<input
						className={classes.TodoInput}
						value={task}
						placeholder="What needs to be done?"
						onChange={(e) => setTask(e.target.value)}
						autoFocus={true}
					/>
				</form>
				{loading ? <Spinner /> : main}
				{footer}
				<LoginModal active={login} backgroundClicked={() => setLogin(false)}>
					{isLogin ? (
						<form className={classes.LoginForm} onSubmit={(e) => loginUserSubmit(e)}>
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
							{loggingIn ? <Spinner /> : <Button>Login</Button>}
							<span onClick={() => setIsLogin(false)}>Don't have an account? Signup.</span>
						</form>
					) : (
						<form className={classes.LoginForm} onSubmit={(e) => signupUser(e)}>
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
							{loggingIn ? <Spinner /> : <Button>Signup</Button>}
							<span onClick={() => setIsLogin(true)}>Already have an account? Login.</span>
						</form>
					)}
				</LoginModal>
			</div>
			{authorized ? null : <NotAuthed>Login to save your tasks.</NotAuthed>}
			<footer className={classes.Footer}>
				<p>Double-click to edit a todo</p>
				<p>Created by Matthew Kennedy</p>
				<p>
					Inspired by <a href="http://todomvc.com">TodoMVC</a>
				</p>
			</footer>
		</React.Fragment>
	);
};

export default App;
