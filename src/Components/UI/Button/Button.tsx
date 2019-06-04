import React from 'react';
import classes from './Button.module.css';

const Button: React.FC<ITodoButton> = (props) => (
	<button className={classes.Button} onClick={props.clicked}>
		{props.children}
	</button>
);

export default Button;
