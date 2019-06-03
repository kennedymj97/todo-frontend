import React from 'react';
import classes from 'Components/UI/loader/loader.module.css';

const Spinner = () => {
	return (
		<div style={{height: '100%', width: '100%', padding: '5px', boxSizing: 'border-box'}}>
			<div className={classes.loader}>Loading...</div>
		</div>
	);
};

export default Spinner;
