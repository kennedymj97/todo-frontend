import React from 'react';

import classes from './Auth.module.css'

const NotAuthed: React.FC = (props) => {
	return (
		<div className={classes.Container}>
			<span className={classes.Message}>{props.children}</span>
		</div>
	);
};

export default NotAuthed;
