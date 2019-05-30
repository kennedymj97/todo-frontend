import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Message = styled.span`
	font-size: 20px;
	color: rgba(175, 47, 47, 0.4);
	font-weight: 400;
	padding: 8px;
	box-sizing: border-box;
`;

const NotAuthed: React.FC = (props) => {
	return (
		<Container>
			<Message>{props.children}</Message>
		</Container>
	);
};

export default NotAuthed;
