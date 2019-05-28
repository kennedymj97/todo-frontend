import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
	height: 100vh;
	width: 100vw;
	display: ${(props: ILoginModal) => (props.active ? 'visible' : 'none')};
	background: red;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 5;
	opacity: 0.3;
`;

const ModalContainer = styled.div`
	height: 100vh;
	width: 100vw;
	position: fixed;
	display: flex;
	align-items: center;
	top: 0;
	left: 0;
	justify-content: center;
	display: ${(props: ILoginModal) => (props.active ? 'visible' : 'none')};
	z-index: 10;
`;

const LoginContainer = styled.div`
	height: 40%;
	width: 40%;
	background: white;
	border-radius: 8px;
	padding: 30px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
`;

const Modal: React.FC<ILoginModal> = ({ active }) => {
	return (
		<React.Fragment>
			<ModalBackground active={active} />
			<ModalContainer active={active}>
				<LoginContainer>
					<label>Email</label>
					<input />
					<label>Password</label>
					<input />
					<button>Confirm</button>
				</LoginContainer>
			</ModalContainer>
		</React.Fragment>
	);
};

export default Modal;
