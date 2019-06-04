import React from 'react';

import classes from './Modal.module.css';

const Modal: React.FC<ILoginModal> = ({ active, backgroundClicked, children }) => {
	return (
		<div className={classes.ModalContainer} style={{ visibility: active ? 'visible' : 'hidden' }}>
			<div className={classes.ModalBackground} onClick={backgroundClicked} />
			<div
				className={classes.LoginContainer}
				style={{ transform: active ? 'translateY(0)' : 'translateY(-100vh)' }}
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;
